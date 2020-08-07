import { getRepository, Equal, In } from 'typeorm';

import User from '../models/User';
import Repository from '../models/Repository';

import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  request_login: string;
}

class GetUserRepositoriesService {
  public async execute({
    user_id,
    request_login,
  }: Request): Promise<Repository[]> {
    const usersRepository = getRepository(User);
    const repositoriesRepository = getRepository(Repository);

    const user = await usersRepository.findOne(user_id);
    if (!user) {
      throw new AppError(
        'Only authenticated users can list repositories.',
        401,
      );
    }

    const requestUser = await usersRepository.findOne({
      where: { login: request_login },
    });
    if (!requestUser) {
      throw new AppError('This user does not exist', 400);
    }

    const repositories = await repositoriesRepository.find({
      user_id: Equal(requestUser.id),
      private: requestUser.id === user.id ? In([true, false]) : Equal(false),
    });

    return repositories;
  }
}

export default GetUserRepositoriesService;
