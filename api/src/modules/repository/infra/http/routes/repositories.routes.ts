import { Router } from 'express';

import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';
import RepositoryController from '../controllers/RepositoryController';
import UserRepositoryController from '../controllers/UserRepositoryController';

const repositoriesRouter = Router();
const userRepositoryController = new UserRepositoryController();
const repositoryController = new RepositoryController();

repositoriesRouter.use(ensureAuthenticated);

repositoriesRouter.get('/', userRepositoryController.index);
repositoriesRouter.get('/:repository_id', repositoryController.show);

export default repositoriesRouter;
