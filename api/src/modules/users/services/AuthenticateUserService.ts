import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import authConfig from '../../../config/auth';

type Request = {
  login: string;
  password: string;
};

type Response = {
  user: User;
  token: string;
};

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ login, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByLoginOrEmail(login, login);

    if (!user) {
      throw new AppError('Incorrect login/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect e-mail/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}

export default AuthenticateUserService;
