import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import RegistryError from './errors/RegistryError';
import AppError from './errors/AppError';

import routes from './routes';

const app = express();
app.use(cors());

app.use(express.json());
app.use('/health', (request, response) => {
  return response.json({ status: 'healthy' });
});
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof RegistryError) {
      return response.status(error.statusCode.code).json({
        errors: [{ code: error.statusCode.title, message: error.message }],
      });
    }
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
