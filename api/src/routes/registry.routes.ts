import { Router } from 'express';

import AuthRegistryUserService from '../services/AuthRegistryUserService';
import AuthorizeRegistryUserService from '../services/AuthorizeRegistryUserService';
import ProcessRegistryWebhookService from '../services/ProcessRegistryWebhookService';

const registryRouter = Router();
registryRouter.get('/auth', async (request, response) => {
  // scope: repository:repik:pull
  //        repository:repik:push,pull
  //        registry:catalog:*

  const { authorization } = request.headers;
  const { account, service, scope } = request.query;

  const authRegistryUser = new AuthRegistryUserService();
  const authorizeRegistryUser = new AuthorizeRegistryUserService();

  const user = await authRegistryUser.execute({
    authorization: authorization as string,
    username: account as string,
  });

  const token = await authorizeRegistryUser.execute({
    user,
    service: service as string,
    scope: scope as string,
  });

  return response.json({ token });
});

registryRouter.use('/webhooks', async (request, response) => {
  await new Promise((resolve, reject) => {
    request.on('data', async (buff: Buffer) => {
      try {
        const json = buff.toString('utf-8');
        const { events } = JSON.parse(json);

        const processRegistryWebhook = new ProcessRegistryWebhookService();
        await processRegistryWebhook.execute(events);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  return response.send();
});

export default registryRouter;

/**
 * type - tipo, exemplo: registry, repository
 * Class: - ??????
 * Name: - nome do recurso que está sendo acessado, ex: catalog, ou nome do repo
 * Action - ação a ser executada: push, pull, *
 */
