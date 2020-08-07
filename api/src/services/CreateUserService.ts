import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  login: string;
  password: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    login,
    password,
  }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const userExist = await userRepository.findOne({
      where: [{ email }, { login }],
    });

    if (userExist) {
      throw new AppError('E-mail or Username already exists', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      login,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
