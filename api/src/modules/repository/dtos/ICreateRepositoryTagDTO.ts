import Repository from '../infra/typeorm/entities/Repository';

export default interface ICreateRepositoryTagDTO {
  title: string;
  digest: string;
  repository: Repository;
}
