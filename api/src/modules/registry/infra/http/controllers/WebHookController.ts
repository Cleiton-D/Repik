import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ProcessWebHookService from '../../../services/ProcessWebHookService';

export default class WebHookController {
  public async create(request: Request, response: Response) {
    await new Promise((resolve, reject) => {
      request.on('data', async (buffer: Buffer) => {
        try {
          const json = buffer.toString('utf-8');
          const { events } = JSON.parse(json);

          const processRegistryWebHook = container.resolve(
            ProcessWebHookService,
          );
          await processRegistryWebHook.execute(events);
          resolve();
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
    });

    return response.send();
  }
}

/**
 * type - tipo, exemplo: registry, repository
 * Class: - ??????
 * Name: - nome do recurso que está sendo acessado, ex: catalog, ou nome do repo
 * Action - ação a ser executada: push, pull, *
 */
