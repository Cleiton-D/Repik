import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';
import base32 from 'hi-base32';
import crypto from 'crypto';

import User from '../models/User';
import Repository from '../models/Repository';

import { certs } from '../config/paths';
import { sign } from 'jsonwebtoken';

interface Request {
  user: User;
  service: string;
  scope: string;
}

interface AccessData {
  type: string;
  name: string;
  actions: string[];
}

type ScopeType = 'repository' | 'registry';
type ScopeAction = 'push' | 'pull' | '*';

class AuthorizeRegistryUserService {
  public async execute({ user, service, scope }: Request): Promise<string> {
    const actions = scope ? await this.loadScope(scope, user.login) : undefined;

    const pemKey = fs.readFileSync(path.join(certs, 'server-key.pem'));
    const pkey = crypto.createPublicKey(pemKey);
    const publicDer = pkey.export({ type: 'spki', format: 'der' });

    const hash = crypto.createHash('sha256').update(publicDer).digest('hex');
    const b = Buffer.from(hash, 'hex').slice(0, 30);

    const keyID = base32
      .encode(b)
      .match(/.{1,4}/g)
      ?.join(':');

    const token = sign(
      {
        access: actions ? [actions] : [],
      },
      pemKey,
      {
        issuer: 'Issuer',
        subject: user.id,
        audience: service,
        expiresIn: '7d',
        keyid: keyID,
        algorithm: 'RS256',
      },
    );

    return token;
  }

  private async loadScope(
    scope: string,
    login: string | undefined,
  ): Promise<AccessData> {
    const repositoryRepository = getRepository(Repository);

    // repository:username/reponame:action,action
    const [type, name, actionsStr] = scope.split(':');
    const actions = actionsStr.split(',') as ScopeAction[];

    if ((type as ScopeType) === 'repository') {
      // VERIFICA SE ELE POSSUI "/" NO NOME DE ACORDO COM A ESPECIFICAÇÃO username/repository
      let reponame = name;
      let userLogin = '';
      if (name.includes('/')) {
        const [ulogin, rname] = name.split('/');
        reponame = rname;
        userLogin = ulogin;
      }
      const repository = await repositoryRepository.findOne({
        where: {
          title: reponame,
        },
      });

      const newActions = actions.reduce<ScopeAction[]>(
        (accumulator, action) => {
          // SE A AÇÃO FOR DO TIPO PUSH
          if (action === 'push') {
            // VERIFICA SE O REPOSIÓTIO EXISTE E PERTENCE AO USUÁRIO
            if (repository && repository.user.login === login) {
              accumulator.push(action);

              // VERIFICA SE O USERNAME QUE ESTÁ NO NOME DO REPOSITÓRIO É IGUAL AO LOGIN DO USUÁRIO
            } else if (userLogin === login) {
              accumulator.push(action);
            }
            return accumulator;
          }

          // CASO A AÇÃO SEJA DO TIPO PULL
          if (action === 'pull') {
            // VERIFICA SE O REPOSITÓRIO NÃO É PRIVADO
            if (!repository?.private) {
              accumulator.push(action);

              // SE FOR PRIVADO VERIFICA SE O USUÁRIO É DONO DESSE REPOSITÓRIO
            } else if (repository.private && repository.user.login === login) {
              accumulator.push(action);
            }
          }

          return accumulator;
        },
        [],
      );

      return { type, name, actions: newActions };
    }

    return {} as AccessData;
  }
}

export default AuthorizeRegistryUserService;
