import { Router } from 'express';

import registryRouter from './registry.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import repositoriesrouter from './repositories.routes';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World' });
});

routes.use('/registry', registryRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/repositories', repositoriesrouter);

export default routes;
