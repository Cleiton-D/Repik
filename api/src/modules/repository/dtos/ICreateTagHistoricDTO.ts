import RepositoryTag from '../infra/typeorm/entities/RepositoryTag';
import User from '../../users/infra/typeorm/entities/User';

export default interface ICreateTagHistoricDTO {
  tag: RepositoryTag;
  user: User;
  event_id: string;
  timestamp: string;
  action: 'push' | 'pull';
}
