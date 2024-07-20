import { config } from '../../../configs/config';
import { IUserDocument } from './user.interface';
import JWT from 'jsonwebtoken';

export const generateToken = (user: IUserDocument): string => {
  const { _id, role, schoolId } = user;

  return JWT.sign({ user: { _id, role, schoolId } }, config.jwtSecret);
};
