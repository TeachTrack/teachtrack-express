// src/middleware/checkUserCreationPermissions.ts
import { NextFunction } from 'express';
import { UserRoles } from '../features/user/utils/user.enum';
import { Request, Response } from '../utils/interfaces/express.interface';
import { BadRequestError } from './error-handler.middleware';
import { ErrorMessages } from '../utils/enums/error-messages.enum';
import { userCreateRolePermissions } from '../utils/helpers/roles-permissions';

export const checkUserCreationPermissions = (req: Request, res: Response, next: NextFunction) => {
  const role = req.role;
  const { role: newUserRole } = req.body;

  if (!role) throw new BadRequestError(ErrorMessages.Unauthorized);

  if (!userCreateRolePermissions[role].includes(newUserRole)) {
    return res.status(403).json({ message: `User with role ${role} cannot create user with role ${newUserRole}` });
  }

  next();
};
