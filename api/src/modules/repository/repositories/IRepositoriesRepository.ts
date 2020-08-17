import User from '../../users/infra/typeorm/entities/User';
import Repository from '../infra/typeorm/entities/Repository';
import ICreateRepositoryDTO from '../dtos/ICreateRepositoryDTO';

export default interface IRepositoriesRepository {
  findById(id: string): Promise<Repository | undefined>;
  findByTitleAndUser(
    title: string,
    user: User,
  ): Promise<Repository | undefined>;
  findAllByUser(user: User): Promise<Repository[]>;

  create(data: ICreateRepositoryDTO): Promise<Repository>;
}
