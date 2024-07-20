import { Router } from 'express';
import { authRequired } from '../../middlewares/auth-required.middleware';
import { requireAccess } from '../../middlewares/required-access.middleware';
import { UserRoles } from '../user/utils/user.enum';
import { asyncWrapper } from '../../helper/async-wrapper';
import { clearCache } from './cache.controller';

const cacheRouter = Router();

cacheRouter.post('/clear-cache', authRequired, asyncWrapper(clearCache));

export { cacheRouter };
