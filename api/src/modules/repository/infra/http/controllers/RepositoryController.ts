import { Request, Response } from 'express';
import Repository from '../../typeorm/entities/Repository';
import { container } from 'tsyringe';
import FindRepositoryService from '../../../services/FindRepositoryService';

export default class RepositoryController {
  public async show(request: Request, response: Response) {
    const findRepository = container.resolve(FindRepositoryService);

    const { repository_id } = request.params;
    const repository = findRepository.execute({
      user_id: request.user.id,
      repository_id,
    });

    return response.json(repository);
  }
}
