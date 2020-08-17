import { container } from 'tsyringe';

import './providers';
import '../../modules/registry/providers';
import '../../modules/users/providers';

import IUsersRepository from '../../modules/users/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/typeorm/repositories/UsersRepository';

import IRepositoriesRepository from '../../modules/repository/repositories/IRepositoriesRepository';
import RepositoriesRepository from '../../modules/repository/infra/typeorm/repositories/RepositoriesRepository';

import IRepositoryTagsRepository from '../../modules/repository/repositories/IRepositoryTagsRepository';
import RepositoryTagsRepository from '../../modules/repository/infra/typeorm/repositories/RepositoryTagsRepository';

import IRepositoryTagHistoric from '../../modules/repository/repositories/IRepositoryTagHistoricsRepository';
import RepositoryTagsHistoric from '../../modules/repository/infra/typeorm/repositories/RepositoryTagsHistoricsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IRepositoriesRepository>(
  'RepositoriesRepository',
  RepositoriesRepository,
);

container.registerSingleton<IRepositoryTagsRepository>(
  'RepositoryTagsRepository',
  RepositoryTagsRepository,
);

container.registerSingleton<IRepositoryTagHistoric>(
  'RepositoryTagHistoricRepository',
  RepositoryTagsHistoric,
);
