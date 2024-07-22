import { Router } from 'express';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { asyncWrapper } from '../../helper/async-wrapper';
import {
  assignDirectorSchool,
  createSchool,
  getCoursesBySchoolId,
  getSchool,
  getSchools,
  getUsersBySchoolId,
  updateSchool,
} from './school.controller';
import { requireAccess } from '../../middlewares/required-access.middleware';
import { UserRoles } from '../user/utils/user.enum';
import { validator } from '../../utils/helpers/joi-validation';
import { assignDirectorValidator, createSchoolValidator, updateSchoolValidator } from './school.validator';

const schoolRouter = Router();

schoolRouter.post(
  '/school',
  validator(createSchoolValidator),
  authRequired,
  requireAccess(UserRoles.SUPER_ADMIN),
  asyncWrapper(createSchool),
);
schoolRouter.put(
  '/school/:id',
  validator(updateSchoolValidator),
  authRequired,
  requireAccess(UserRoles.ADMIN),
  asyncWrapper(updateSchool),
);
schoolRouter.patch(
  '/school/:id',
  validator(assignDirectorValidator),
  authRequired,
  requireAccess(UserRoles.SUPER_ADMIN),
  asyncWrapper(assignDirectorSchool),
);
schoolRouter.get('/schools', authRequired, requireAccess(UserRoles.SUPER_ADMIN), asyncWrapper(getSchools));
schoolRouter.get('/school/:id', authRequired, requireAccess(UserRoles.ADMIN), asyncWrapper(getSchool));
schoolRouter.get(
  '/school/:id/users',
  authRequired,
  requireAccess(UserRoles.SUPER_ADMIN),
  asyncWrapper(getUsersBySchoolId),
);
schoolRouter.get(
  '/school/:id/courses',
  authRequired,
  requireAccess(UserRoles.SUPER_ADMIN),
  asyncWrapper(getCoursesBySchoolId),
);

export { schoolRouter };
