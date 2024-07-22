import { Application } from 'express';
import { config } from './configs/config';
import userRouter from './features/user/user.route';
import { schoolRouter } from './features/school/school.route';
import { cacheRouter } from './features/cache/cache.route';

export const routes = (app: Application) => {
  app.use(config.basePath, cacheRouter);
  app.use(config.basePath, userRouter);
  app.use(config.basePath, schoolRouter);
};
