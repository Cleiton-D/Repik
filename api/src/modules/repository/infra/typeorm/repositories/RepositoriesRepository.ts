import { Repository, getRepository } from 'typeorm';
import IRepositoriesRepository from '../../../repositories/IRepositoriesRepository';
import User from '../../../../users/infra/typeorm/entities/User';
import RepositoryEntity from '../entities/Repository';
import ICreateRepositoryDTO from '../../../dtos/ICreateRepositoryDTO';

export default class RepositoriesRepository implements IRepositoriesRepository {
  private ormRepository: Repository<RepositoryEntity>;

  constructor() {
    this.ormRepository = getRepository(RepositoryEntity);
  }

  public async findById(id: string): Promise<RepositoryEntity | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findAllByUser(user: User): Promise<RepositoryEntity[]> {
    return this.ormRepository.find({
      where: { user_id: user.id },
    });
  }

  public async findByTitleAndUser(
    title: string,
    user: User,
  ): Promise<RepositoryEntity | undefined> {
    const repository = this.ormRepository.findOne({
      where: { title, user_id: user.id },
      relations: ['user'],
      loadEagerRelations: true,
    });

    return repository;
  }

  public async create({
    title,
    isPrivate = false,
    user,
  }: ICreateRepositoryDTO): Promise<RepositoryEntity> {
    const repository = this.ormRepository.create({
      title,
      private: isPrivate,
      user,
    });

    return this.ormRepository.save(repository);
  }
}
