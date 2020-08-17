import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '../../../services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response) {
    const { login, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);
    const { user, token } = await authenticateUser.execute({ login, password });

    delete user.password;

    return response.json({ user, token });
  }
}
