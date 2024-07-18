import { Router } from 'express';
import { asyncWrapper } from '../../helper/async-wrapper';
import {
  getUserController,
  getStaffsController,
  loginUserController,
  registerUserController,
  getMeController,
} from './user.controller';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { checkUserCreationPermissions } from '../../middlewares/check-user-create-permissions.middleware';
import { checkGetUsersQueryPermissions } from '../../middlewares/check-user-query-permissions.middleware';
import { validator } from '../../utils/helpers/joi-validation';
import { loginValidator, registerValidator } from './user.validator';

const userRouter = Router();

userRouter.post('/auth/login', validator(loginValidator), asyncWrapper(loginUserController));
userRouter.post(
  '/auth/register',
  validator(registerValidator),
  authRequired,
  checkUserCreationPermissions,
  asyncWrapper(registerUserController),
);
userRouter.get('/me', authRequired, asyncWrapper(getMeController));
userRouter.get('/users/:userId', authRequired, asyncWrapper(getUserController));
userRouter.get('/users', authRequired, checkGetUsersQueryPermissions, asyncWrapper(getStaffsController));

export default userRouter;
