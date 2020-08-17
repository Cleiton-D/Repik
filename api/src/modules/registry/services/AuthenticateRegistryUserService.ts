import User from '../../users/infra/typeorm/entities/User';
import RegistryError from '../../../shared/errors/RegistryError';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IHashProvider from '../../users/providers/HashProvider/models/IHashProvider';

type IRequest = {
  authorization: string;
  username: string;
};

@injectable()
class AuthenticateRegistryUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ username, authorization }: IRequest): Promise<User> {
    if (!authorization) {
      throw new RegistryError('Missing authorization parameters', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    let authUser, authPass;
    try {
      const authorizationDecoded = Buffer.from(
        authorization.split(' ')[1],
        'base64',
      ).toString('utf-8');

      const basicDecoded = authorizationDecoded.split(':');
      authUser = basicDecoded[0];
      authPass = basicDecoded[1];
    } catch (err) {
      throw new RegistryError('Invalid authorization parameters', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    if (username !== authUser) {
      throw new RegistryError('Invalid authentication parameters', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    const user = await this.usersRepository.findByLogin(username);
    if (!user) {
      throw new RegistryError('Incorrect username/password combination', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    const passwordMatched = await this.hashProvider.compareHash(
      authPass,
      user.password,
    );
    if (!passwordMatched) {
      throw new RegistryError('Incorrect username/password combination', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    return user;
  }
}

export default AuthenticateRegistryUserService;
