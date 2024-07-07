import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UserRoles } from '../../features/user/utils/user.enum';

export interface JwtPayload {
  userId?: string;
  role?: UserRoles;
}

export interface Request<T = any> extends ExpressRequest, JwtPayload {
  body: T;
}

export interface Response extends ExpressResponse {}
