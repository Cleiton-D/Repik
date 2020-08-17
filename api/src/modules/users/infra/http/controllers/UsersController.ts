import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '../../../services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response) {
    const { name, email, login, password } = request.body;

    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({ name, email, login, password });

    delete user.password;

    return response.json(user);
  }
}
