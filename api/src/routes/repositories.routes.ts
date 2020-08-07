import { Router } from 'express';
import { getRepository } from 'typeorm';

import Repository from '../models/Repository';

import GetUserRepositoriesService from '../services/GetUserRepositoriesService';
import FindRepositoryService from '../services/FindRepositoryService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import repositoryTagRouter from './repositorytag.routes';

const repositoriesRouter = Router();
repositoriesRouter.use(ensureAuthenticated);

repositoriesRouter.get('/all', async (request, response) => {
  const repositoryRepository = getRepository(Repository);

  const repositories = await repositoryRepository.find({
    where: {
      private: false,
    },
  });

  return response.json(repositories);
});

repositoriesRouter.get('/', async (request, response) => {
  const { user } = request.query;

  const getUserRepositories = new GetUserRepositoriesService();
  const repositories = await getUserRepositories.execute({
    user_id: request.user.id,
    request_login: user as string,
  });

  return response.json(repositories);
});

repositoriesRouter.get('/:repository_id', async (request, response) => {
  const { repository_id } = request.params;

  const findRepository = new FindRepositoryService();
  const repository = await findRepository.execute({
    repository_id,
    user_id: request.user.id,
  });

  return response.json(repository);
});

repositoriesRouter.use('/:repository_id/tags', repositoryTagRouter);

export default repositoriesRouter;
