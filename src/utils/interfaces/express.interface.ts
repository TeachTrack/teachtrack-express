import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UserRoles } from '../../features/user/utils/user.enum';
import { ISchoolDocument } from '../../features/school/utils/school.interface';

export interface JwtPayload {
  user?: {
    _id: string;
    role: UserRoles;
    schoolId: string;
  };
}

export interface ISchoolPayload {
  school?: {
    id: ISchoolDocument['_id'];
    subdomain: ISchoolDocument['subdomain'];
  };
}

export interface Request<T = any> extends ExpressRequest, JwtPayload, ISchoolPayload {
  body: T;
}

export interface Response extends ExpressResponse {}
