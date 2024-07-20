import { Application, NextFunction, Request, Response } from 'express';
import HTTPS_STATUS from 'http-status-codes';
import { IErrorResponse } from '../utils/interfaces/error-handler.interface';
import bunyan from 'bunyan';
import { CustomError } from '../middlewares/error-handler.middleware';
import HTTP_STATUS from 'http-status-codes';
import { ErrorMessages } from '../utils/enums/error-messages.enum';

const log = bunyan.createLogger({ name: 'global-error-handler' });

export const globalErrorHandler = (app: Application): void => {
  app.all('*', (req: Request, res: Response) => {
    res.status(HTTPS_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
  });

  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.error(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.serializeErrors());
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.InternalServerError, error: error });
  });
};
