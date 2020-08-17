import ICreateTagHistoricDTO from '../dtos/ICreateTagHistoricDTO';
import RepositoryTagHistorics from '../infra/typeorm/entities/RepositoryTagHistorics';

export default interface IRepositoryTagHistoricsRepository {
  create(data: ICreateTagHistoricDTO): Promise<RepositoryTagHistorics>;
}
