import { Router } from 'express';

import AuthenticateController from '../controllers/AuthenticateController';

const registryRouter = Router();
const authenticateController = new AuthenticateController();

registryRouter.get('/', authenticateController.create);

export default registryRouter;
