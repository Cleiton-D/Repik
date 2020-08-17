import Repository from '../infra/typeorm/entities/Repository';
import { injectable, inject } from 'tsyringe';
import IRepositoriesRepository from '../repositories/IRepositoriesRepository';
import IUsersRepository from '../../users/repositories/IUsersRepository';
import AppError from '../../../shared/errors/AppError';

type Request = {
  repository_id: string;
  user_id: string;
};

@injectable()
class FindRepositoryService {
  constructor(
    @inject('RepositoriesRepository')
    private repositoriesRepository: IRepositoriesRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    repository_id,
  }: Request): Promise<Repository> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError(
        'Only authenticated users can view repositories.',
        401,
      );
    }

    const repository = await this.repositoriesRepository.findById(
      repository_id,
    );
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
