import { Router } from 'express';
import { getRepository } from 'typeorm';

import RepositoryTag from '../models/RepositoryTag';

import FindRepositoryService from '../services/FindRepositoryService';

const tagRouter = Router();

tagRouter.get('/', async (request, response) => {
  const { repository_id } = request.params;

  const findRepository = new FindRepositoryService();
  const repository = await findRepository.execute({
    repository_id,
    user_id: request.user.id,
  });

  const repositoryTagRepository = getRepository(RepositoryTag);
  const tags = await repositoryTagRepository.find({
    where: {
      repository_id: repository.id,
    },
    loadEagerRelations: false,
  });

  return response.json(tags);
});

tagRouter.get('/get', async (request, response) => {
  const { repository_id } = request.params;
  const { tag: tag_id } = request.query;

  const findRepository = new FindRepositoryService();
  const repository = await findRepository.execute({
    repository_id,
    user_id: request.user.id,
  });

  const repositoryTagRepository = getRepository(RepositoryTag);
  const tag = await repositoryTagRepository.findOne({
    where: {
      id: tag_id,
      repository_id: repository.id,
    },
    loadEagerRelations: false,
  });

  return response.json(tag);
});

export default tagRouter;
