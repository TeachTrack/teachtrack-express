import { Router } from 'express';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { asyncWrapper } from '../../helper/async-wrapper';
import { assignDirectorSchool, createSchool, getSchool, getSchools, updateSchool } from './school.controller';
import { requireAccess } from '../../middlewares/required-access.middleware';
import { UserRoles } from '../user/utils/user.enum';
import { validator } from '../../utils/helpers/joi-validation';
import { assignDirectorValidator, createSchoolValidator, updateSchoolValidator } from './school.validator';

const schoolRouter = Router();

schoolRouter.post('/school', validator(createSchoolValidator), authRequired, requireAccess(UserRoles.SUPER_ADMIN), asyncWrapper(createSchool));
schoolRouter.put('/school/:id', validator(updateSchoolValidator), authRequired, requireAccess(UserRoles.SUPER_ADMIN), asyncWrapper(updateSchool));
schoolRouter.patch(
  '/school/:id',
  validator(assignDirectorValidator),
  authRequired,
  requireAccess(UserRoles.SUPER_ADMIN),
  asyncWrapper(assignDirectorSchool),
);
schoolRouter.get('/schools', authRequired, requireAccess(UserRoles.SUPER_ADMIN), asyncWrapper(getSchools));
schoolRouter.get('/school/:id', authRequired, requireAccess(UserRoles.SUPER_ADMIN), asyncWrapper(getSchool));

export { schoolRouter };
