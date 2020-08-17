import Repository from '../infra/typeorm/entities/Repository';
import RepositoryTag from '../infra/typeorm/entities/RepositoryTag';
import ICreateRepositoryTagDTO from '../dtos/ICreateRepositoryTagDTO';

export default interface IRepositoryTagsRepository {
  findByNameAndRepository(
    title: string,
    repository: Repository,
  ): Promise<RepositoryTag | undefined>;

  create(data: ICreateRepositoryTagDTO): Promise<RepositoryTag>;
}
