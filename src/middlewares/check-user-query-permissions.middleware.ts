import { NextFunction } from 'express';
import { Request, Response } from '../utils/interfaces/express.interface';
import { roleHierarchy } from '../utils/helpers/roles-permissions';
import { UserRoles } from '../features/user/utils/user.enum';
import HTTP_STATUS from 'http-status-codes';
import { ErrorMessages } from '../utils/enums/error-messages.enum';

export const checkGetUsersQueryPermissions = async (req: Request, res: Response, next: NextFunction) => {
  const { role: userRole } = req.user || {};
  const { role: queryRole } = req.query;

  if (!queryRole) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ErrorMessages.MissingQueryRole });
  }

  const userRoleHierarchy = roleHierarchy[userRole as UserRoles];
  const queryRoleHierarchy = roleHierarchy[queryRole as UserRoles];

  if (queryRoleHierarchy >= userRoleHierarchy) {
    return res.status(403).json({ message: ErrorMessages.NoAccess });
  }

  next();
};
