import { Router } from 'express';
import { asyncWrapper } from '../../helper/async-wrapper';
import {
  getMeController,
  getStaffsController,
  getUserController,
  loginUserController,
  registerUserController,
  updateUser,
} from './user.controller';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { checkUserCreationPermissions } from '../../middlewares/check-user-create-permissions.middleware';
import { checkGetUsersQueryPermissions } from '../../middlewares/check-user-query-permissions.middleware';
import { validator } from '../../utils/helpers/joi-validation';
import { loginValidator, registerValidator, updateUserValidator } from './user.validator';
import { schoolSubdomainRequired } from '../../middlewares/school-subdomain-required.middleware';
import { requireAccess } from '../../middlewares/required-access.middleware';
import { UserRoles } from './utils/user.enum';

const userRouter = Router();

userRouter.post(
  '/auth/register',
  validator(registerValidator),
  authRequired,
  checkUserCreationPermissions,
  schoolSubdomainRequired,
  requireAccess(UserRoles.STAFF),
  asyncWrapper(registerUserController),
);
userRouter.post('/auth/login', validator(loginValidator), schoolSubdomainRequired, asyncWrapper(loginUserController));
userRouter.get('/me', authRequired, asyncWrapper(getMeController));

// userRouter.put(
//   '/user/:userId',
//   validator(updateUserValidator),
//   checkUserCreationPermissions,
//   schoolSubdomainRequired,
//   asyncWrapper(updateUser),
// );
// userRouter.get('/users/:userId', authRequired, asyncWrapper(getUserController));
// userRouter.get('/users', authRequired, checkGetUsersQueryPermissions, asyncWrapper(getStaffsController));

export default userRouter;
