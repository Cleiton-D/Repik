import { getRepository } from 'typeorm';

import User from '../models/User';
import Repository from '../models/Repository';
import RepositoryTag from '../models/RepositoryTag';
import TagHistoric from '../models/TagHistoric';

import RegistryError from '../errors/RegistryError';

interface WebHookEvent {
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
}

interface TagHistoricData {
  tag: RepositoryTag;
  user: User;
  event_id: string;
  timestamp: string;
  action: 'push' | 'pull';
}

class ProcessRegistryWebhookService {
  public async execute(events: WebHookEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.processEvent(event)));
  }

  private async processEvent({
    id,
    timestamp,
    action,
    target,
    actor,
  }: WebHookEvent): Promise<void> {
    const repositoryRepository = getRepository(Repository);
    const repositoryTagRepository = getRepository(RepositoryTag);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: {
        login: actor.name,
      },
    });

    if (!user) {
      throw new RegistryError('User does not exist', { code: 400 });
    }

    const [_, title] = target.repository.split('/');
    let repository = await repositoryRepository.findOne({
      where: {
        title,
        user_id: user.id,
      },
    });

    switch (action) {
      case 'pull': {
        if (!repository) {
          throw new RegistryError('Repository does not exist', { code: 400 });
        }

        const tag = await repositoryTagRepository.findOne({
          where: {
            title: target.tag,
            repository_id: repository.id,
          },
        });

        if (!tag) {
          throw new RegistryError('Tag does not exist', { code: 400 });
        }

        await this.insertTagHistoric({
          tag,
          user,
          event_id: id,
          timestamp,
          action,
        });
        break;
      }

      case 'push': {
        let tag: RepositoryTag | undefined = repositoryTagRepository.create();
        if (!repository) {
          repository = repositoryRepository.create({
            title,
            private: false,
            user,
          });

          tag.title = target.tag;
          tag.repository = repository;
          tag.digest = target.digest;
        } else {
          tag = await repositoryTagRepository.findOne({
            where: {
              title: target.tag,
              repository_id: repository.id,
            },
          });

          if (!tag) {
            tag = repositoryTagRepository.create({
              title: target.tag,
              repository,
            });
          }
          tag.digest = target.digest;
        }

        await repositoryRepository.save(repository);
        await repositoryTagRepository.save(tag);
        await this.insertTagHistoric({
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

  private async insertTagHistoric({
    tag,
    user,
    event_id,
    timestamp,
    action,
  }: TagHistoricData): Promise<void> {
    const tagHistoricRepository = getRepository(TagHistoric);
    const tagHistoric = tagHistoricRepository.create({
      tag,
      user,
      event_id,
      event_timestamp: timestamp,
      action,
    });

    await tagHistoricRepository.save(tagHistoric);
  }
}

export default ProcessRegistryWebhookService;
