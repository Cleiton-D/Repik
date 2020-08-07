import { getRepository } from 'typeorm';

import User from '../models/User';
import Repository from '../models/Repository';

import AppError from '../errors/AppError';

interface Request {
  repository_id: string;
  user_id: string;
}

class FindRepositoryService {
  public async execute({
    repository_id,
    user_id,
  }: Request): Promise<Repository> {
    const userRepository = getRepository(User);
    const repositoriesRepository = getRepository(Repository);

    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError(
        'Only authenticated users can view repositories.',
        401,
      );
    }

    const repository = await repositoriesRepository.findOne(repository_id);
    if (!repository) {
      throw new AppError('Repository does not exist.', 400);
    }
    if (repository.private && repository.user_id !== user.id) {
      throw new AppError(
        'You do not have permission to access this repository.',
        401,
      );
    }

    return repository;
  }
}

export default FindRepositoryService;
