import { Repository, getRepository } from 'typeorm';

import IRepositoryTagHistoricsRepository from '../../../repositories/IRepositoryTagHistoricsRepository';
import RepositoryTagHistorics from '../entities/RepositoryTagHistorics';
import ICreateTagHistoricDTO from '../../../dtos/ICreateTagHistoricDTO';

class RepositoryTagsHistoricsRepository
  implements IRepositoryTagHistoricsRepository {
  private ormRepository: Repository<RepositoryTagHistorics>;

  constructor() {
    this.ormRepository = getRepository(RepositoryTagHistorics);
  }

  public async create({
    tag,
    user,
    action,
    timestamp,
    event_id,
  }: ICreateTagHistoricDTO): Promise<RepositoryTagHistorics> {
    const tagHistoric = this.ormRepository.create({
      tag,
      user,
      event_id,
      event_timestamp: timestamp,
      action,
    });

    return this.ormRepository.save(tagHistoric);
  }
}

export default RepositoryTagsHistoricsRepository;
