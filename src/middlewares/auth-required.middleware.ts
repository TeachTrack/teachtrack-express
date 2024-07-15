import { NextFunction } from 'express';
import { JwtPayload, Request, Response } from '../utils/interfaces/express.interface';
import HTTP_STATUS from 'http-status-codes';
import { ErrorMessages } from '../utils/enums/error-messages.enum';
import JWT from 'jsonwebtoken';
import { config } from '../configs/config';
import { UserRoles } from '../features/user/utils/user.enum';

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.header('Authorization');

  if (!bearerToken) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: ErrorMessages.Unauthorized });

  const [_, token] = bearerToken.split(' ');

  try {
    const decoded: JwtPayload = JWT.verify(token, config.jwtSecret) as JwtPayload;

    req.user = {
      _id: decoded.user?._id as string,
      role: decoded.user?.role as UserRoles,
      schoolIds: decoded.user?.schoolIds as string[],
    };

    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: ErrorMessages.Unauthorized });
  }
};
