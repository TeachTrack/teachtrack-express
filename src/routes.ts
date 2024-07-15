import { Application } from 'express';
import { config } from './configs/config';
import userRouter from './features/user/user.route';
import { schoolRouter } from './features/school/school.route';

export const routes = (app: Application) => {
  app.use(config.basePath, userRouter);
  app.use(config.basePath, schoolRouter);
};
