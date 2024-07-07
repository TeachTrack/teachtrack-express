import { Router } from 'express';
import { asyncWrapper } from '../../helper/async-wrapper';
import { getUserController, getStaffsController, loginUserController, registerUserController } from './user.controller';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { checkUserCreationPermissions } from '../../middlewares/check-user-create-permissions.middleware';
import { checkGetUsersQueryPermissions } from '../../middlewares/check-user-query-permissions.middleware';

const userRouter = Router();

userRouter.post('/auth/login', asyncWrapper(loginUserController));
userRouter.post('/auth/register', authRequired, checkUserCreationPermissions, asyncWrapper(registerUserController));
userRouter.get('/users/:userId', authRequired, asyncWrapper(getUserController));
userRouter.get('/users', authRequired, checkGetUsersQueryPermissions, asyncWrapper(getStaffsController));

export default userRouter;
