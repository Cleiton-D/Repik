import { Router } from 'express';

import WebHookController from '../controllers/WebHookController';

const webhookRouter = Router();
const webHookController = new WebHookController();

webhookRouter.use('/', webHookController.create);

export default webhookRouter;
