import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateRegistryUserService from '../../../services/AuthenticateRegistryUserService';
import CreateRegistryTokenService from '../../../services/CreateRegistryTokenService';

export default class AuthenticateController {
  public async create(request: Request, response: Response) {
    const { authorization } = request.headers;
    const { account, service, scope } = request.query;

    const authenticateUser = container.resolve(AuthenticateRegistryUserService);
    const createRegistryToken = container.resolve(CreateRegistryTokenService);

    const user = await authenticateUser.execute({
      username: account as string,
      authorization: authorization as string,
    });

    const token = await createRegistryToken.execute({
      user,
      service: service as string,
      scope: scope as string,
    });

    response.json({ token });
  }
}
