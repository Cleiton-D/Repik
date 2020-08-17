import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

type Request = {
  name: string;
  email: string;
  login: string;
  password: string;
};

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    login,
    password,
  }: Request): Promise<User> {
    const userExist = await this.usersRepository.findByLoginOrEmail(
      login,
      email,
    );

    if (userExist) {
      throw new AppError('E-mail or Username already exists', 400);
    }
    const hashedPassword = await this.hashProvider.generateHash(password);

    return this.usersRepository.create({
      name,
      email,
      login,
      password: hashedPassword,
    });
  }
}

export default CreateUserService;
