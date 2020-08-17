import { Repository, getRepository } from 'typeorm';
import IRepositoryTagsRepository from '../../../repositories/IRepositoryTagsRepository';
import RepositoryTag from '../entities/RepositoryTag';
import RepositoryEntity from '../entities/Repository';
import ICreateRepositoryTagDTO from '../../../dtos/ICreateRepositoryTagDTO';

class RepositoryTagsRepository implements IRepositoryTagsRepository {
  private ormRepository: Repository<RepositoryTag>;

  constructor() {
    this.ormRepository = getRepository(RepositoryTag);
  }

  public async findByNameAndRepository(
    title: string,
    repository: RepositoryEntity,
  ): Promise<RepositoryTag | undefined> {
    return this.ormRepository.findOne({
      where: {
        title,
        repository_id: repository.id,
      },
    });
  }

  public async create({
    title,
    digest,
    repository,
  }: ICreateRepositoryTagDTO): Promise<RepositoryTag> {
    const tag = this.ormRepository.create({ title, digest, repository });
    return this.ormRepository.save(tag);
  }
}

export default RepositoryTagsRepository;
