import { Router } from 'express';

import registryAuthenticationRouter from '../../../../modules/registry/infra/http/routes/authentication.routes';
import registryWebHookRouter from '../../../../modules/registry/infra/http/routes/webhook.routes';
import repositoriesRouter from '../../../../modules/repository/infra/http/routes/repositories.routes';
import sessionsRouter from '../../../../modules/users/infra/http/routes/sessions.routes';
import usersRouter from '../../../../modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/registry/auth', registryAuthenticationRouter);
routes.use('/registry/webhooks', registryWebHookRouter);
routes.use('/repositories', repositoriesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;
