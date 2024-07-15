import { config } from '../../../configs/config';
import { IUserDocument } from './user.interface';
import JWT from 'jsonwebtoken';

export const generateToken = (user: IUserDocument): string => {
  const { _id, role, schoolIds } = user;

  const token = JWT.sign({ user: { _id, role, schoolIds } }, config.jwtSecret);

  return token;
};
