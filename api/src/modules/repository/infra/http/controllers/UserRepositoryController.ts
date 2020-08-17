import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserRepositoryService from '../../../services/ListUserRepositoriesService';

export default class UserRepositoryController {
  public async index(request: Request, response: Response) {
    const listUserRepositories = container.resolve(ListUserRepositoryService);

    const { user } = request.query;
    const repositories = await listUserRepositories.execute({
      user_id: request.user.id,
      request_login: user as string,
    });

    return response.json(repositories);
  }
}
