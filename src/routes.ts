import { Application } from 'express';
import { config } from './configs/config';
import userRouter from './features/user/user.route';

export const routes = (app: Application) => {
  app.use(config.basePath, userRouter);
};
