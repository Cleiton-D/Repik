import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import decodeBasicAuth from '../utils/decodeBasicAuth';

import RegistryError from '../errors/RegistryError';
import User from '../models/User';

interface Request {
  authorization: string;
  username: string;
}

class AuthRegistryUserService {
  public async execute({ authorization, username }: Request): Promise<User> {
    if (!authorization) {
      throw new RegistryError('Missing authorization parameters', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    const { username: userAuth, password } = this.decodeAuth(authorization);

    if (username !== userAuth) {
      throw new RegistryError('Invalid authentication parameters', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: [{ email: username }, { login: username }],
    });

    if (!user) {
      throw new RegistryError('Incorrect username/password combination', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new RegistryError('Incorrect username/password combination', {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }

    return user;
  }

  private decodeAuth(token: string) {
    try {
      return decodeBasicAuth(token);
    } catch (err) {
      throw new RegistryError(err.message, {
        title: 'UNAUTHORIZED',
        code: 401,
      });
    }
  }
}

export default AuthRegistryUserService;
