import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import { certs } from '../../../config/paths';

import User from '../../users/infra/typeorm/entities/User';
import ILibtrustProvider from '../providers/LibtrustProvider/models/ILibtrustProvider';
import RegistryError from '../../../shared/errors/RegistryError';
import IRepositoriesRepository from '../../repository/repositories/IRepositoriesRepository';

type IRequest = {
  user: User;
  service: string;
  scope: string;
};

type AccessData = {
  type: string;
  name: string;
  actions: string[];
};

type ScopeType = 'repository' | 'registry';
type ScopeAction = 'push' | 'pull' | '*';

@injectable()
class CreateRegistryTokenService {
  constructor(
    @inject('LibtrustProvider') private libtrustProvider: ILibtrustProvider,
    @inject('RepositoriesRepository')
    private repositoriesRepository: IRepositoriesRepository,
  ) {}

  public async execute({ service, user, scope }: IRequest): Promise<string> {
    const privateKey = fs.readFileSync(path.join(certs, 'server-key.pem'));

    const keyId = await this.libtrustProvider.generateKid(privateKey);
    if (!keyId) {
      throw new RegistryError('error creating authorization token', {
        code: 400,
      });
    }

    const accessPermitions = scope
      ? [await this.loadScope(scope, user.login, user)]
      : [];

    const token = sign(
      {
        access: accessPermitions,
      },
      privateKey,
      {
        issuer: 'Issuer',
        subject: user.login,
        audience: service,
        expiresIn: '7d',
        keyid: keyId,
        algorithm: 'RS256',
      },
    );

    return token;
  }

  // REWRITE THIS
  private async loadScope(
    scope: string,
    login: string | undefined,
    user: User,
  ): Promise<AccessData> {
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

      const repository = await this.repositoriesRepository.findByTitleAndUser(
        reponame,
        user,
      );

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

export default CreateRegistryTokenService;
