import { config } from '../../../configs/config';
import { IUserDocument } from './user.interface';
import JWT from 'jsonwebtoken';

export const generateToken = (user: IUserDocument): string => {
  const { _id, role } = user;

  const token = JWT.sign({ userId: _id, role }, config.jwtSecret);

  return token;
};
