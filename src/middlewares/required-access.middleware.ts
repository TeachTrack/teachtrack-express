import { NextFunction } from 'express';
import { UserRoles } from '../features/user/utils/user.enum';
import { Request, Response } from '../utils/interfaces/express.interface';
import { ErrorMessages } from '../utils/enums/error-messages.enum';
import HTTP_STATUS from 'http-status-codes';
import { rolePermissions } from '../utils/helpers/roles-permissions';

export const requireAccess = (requiredRole: UserRoles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user || {};

    if (!role) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ErrorMessages.Unauthorized });
    }

    if (rolePermissions[role].includes(requiredRole)) {
      return next();
    }

    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: ErrorMessages.NoAccess });
  };
};
