import User from '../../users/infra/typeorm/entities/User';

export default interface ICreateRepositoryDTO {
  title: string;
  isPrivate?: boolean;
  user: User;
}
