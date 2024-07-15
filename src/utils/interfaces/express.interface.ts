import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UserRoles } from '../../features/user/utils/user.enum';

export interface JwtPayload {
  user?: {
    _id: string;
    role: UserRoles;
    schoolIds: string[];
  };
}

export interface Request<T = any> extends ExpressRequest, JwtPayload {
  body: T;
}

export interface Response extends ExpressResponse {}
