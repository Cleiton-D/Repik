import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../../users/repositories/IUsersRepository';
import RegistryError from '../../../shared/errors/RegistryError';
import IRepositoriesRepository from '../../repository/repositories/IRepositoriesRepository';
import IRepositoryTagsRepository from '../../repository/repositories/IRepositoryTagsRepository';
import IRepositoryTagHistoricsRepository from '../../repository/repositories/IRepositoryTagHistoricsRepository';

type WebHookEvent = {
  id: string;
  timestamp: string;
  action: 'push' | 'pull';
  target: {
    digest: string;
    repository: string;
    tag: string;
  };
  actor: {
    name: string;
  };
};

type IRequest = WebHookEvent[];

@injectable()
class ProcessWebHookService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('RepositoriesRepository')
    private repositoriesRepository: IRepositoriesRepository,
    @inject('RepositoryTagsRepository')
    private repositoryTagsRepository: IRepositoryTagsRepository,
    @inject('RepositoryTagHistoricRepository')
    private repositoryTagHistoricsRepository: IRepositoryTagHistoricsRepository,
  ) {}

  public async execute(events: IRequest): Promise<void[]> {
    return Promise.all(events.map(event => this.processEvent(event)));
  }

  private async processEvent({
    id,
    timestamp,
    action,
    actor,
    target,
  }: WebHookEvent) {
    const user = await this.usersRepository.findByLogin(actor.name);

    if (!user) {
      throw new RegistryError('User does not exist', { code: 400 });
    }

    const [_, title] = target.repository.split('/');
    let repository = await this.repositoriesRepository.findByTitleAndUser(
      title,
      user,
    );

    switch (action) {
      case 'pull': {
        if (!repository) {
          throw new RegistryError('Repository does not exist', { code: 400 });
        }

        const tag = await this.repositoryTagsRepository.findByNameAndRepository(
          target.tag,
          repository,
        );

        if (!tag) {
          throw new RegistryError('Tag does not exist', { code: 400 });
        }

        await this.repositoryTagHistoricsRepository.create({
          action,
          event_id: id,
          tag,
          timestamp,
          user,
        });
        break;
      }

      case 'push': {
        if (!repository) {
          repository = await this.repositoriesRepository.create({
            title,
            user,
          });
        }

        let tag = await this.repositoryTagsRepository.findByNameAndRepository(
          target.tag,
          repository,
        );

        if (!tag) {
          tag = await this.repositoryTagsRepository.create({
            title: target.tag,
            digest: target.digest,
            repository,
          });
        }

        await this.repositoryTagHistoricsRepository.create({
          action,
          event_id: id,
          tag,
          timestamp,
          user,
        });
        break;
      }

      default:
    }
  }
}

export default ProcessWebHookService;
