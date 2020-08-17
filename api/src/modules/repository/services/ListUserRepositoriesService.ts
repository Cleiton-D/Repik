import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../../users/repositories/IUsersRepository';
import IRepositoriesRepository from '../repositories/IRepositoriesRepository';
import AppError from '../../../shared/errors/AppError';
import Repository from '../infra/typeorm/entities/Repository';

type Request = {
  user_id: string;
  request_login: string;
};

@injectable()
class ListUserRepositoryService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('RepositoriesRepository')
    private repositoriesRepository: IRepositoriesRepository,
  ) {}

  public async execute({
    user_id,
    request_login,
  }: Request): Promise<Repository[]> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError(
        'Only authenticated users can list repositories.',
        401,
      );
    }

    const requestUser = await this.usersRepository.findByLogin(request_login);
    if (!requestUser) {
      throw new AppError('This user does not exist', 400);
    }

    const repositories = await this.repositoriesRepository.findAllByUser(
      requestUser,
    );

    return user.id === requestUser.id
      ? repositories
      : repositories.filter(repository => repository.private === false);
  }
}

export default ListUserRepositoryService;
