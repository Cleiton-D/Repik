import path from 'path';
import { getRepository } from 'typeorm';

import User from '../models/User';
import Repository from '../models/Repository';

import { externalScripts, certs } from '../config/paths';
import runCommand from '../utils/runCommand';

interface Request {
  user: User;
  service: string;
  scope: string;
}

type ScopeType = 'repository' | 'registry';
type ScopeAction = 'push' | 'pull' | '*';

class AuthorizeRegistryUserService {
  public async execute({ user, service, scope }: Request): Promise<string> {
    const newScope = scope ? await this.loadScope(scope, user.login) : '';

    const cmd = `go run ${path.join(
      externalScripts,
      'token.go',
    )} -key ${path.join(
      certs,
      'server-key.pem',
    )} -service ${service} -issuer Issuer -username ${
      user.login || user.email
    } -scope '${newScope || ''}'`;

    const token = await runCommand(cmd);
    return token;
  }

  private async loadScope(
    scope: string,
    login: string | undefined,
  ): Promise<string> {
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

          accumulator.push(action);
          return accumulator;
        },
        [],
      );

      return `${type}:${name}:${newActions.join(',')}`;
    }

    return scope;
  }
}

export default AuthorizeRegistryUserService;
