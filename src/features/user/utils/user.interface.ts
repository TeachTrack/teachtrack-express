import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserGender, UserRoles, UserStatus } from './user.enum';

export interface IUserDocument extends Document {
  _id: ObjectId;
  fullName: string;
  phoneNumber: string;
  role: UserRoles;
  status: UserStatus;
  gender: UserGender;
  age: number;
  password: string;
  guardianName: string | undefined;
  guardianPhoneNumber: string | undefined;
  address: string | undefined;
  comparePassword: (password: string) => Promise<boolean>;
  hashPassword: (password: string) => Promise<string>;
}

export interface ILoginUserBody extends Pick<IUserDocument, 'phoneNumber' | 'password'> {}

export interface IRegisterUserBody
  extends Pick<
    IUserDocument,
    | 'fullName'
    | 'phoneNumber'
    | 'role'
    | 'gender'
    | 'age'
    | 'password'
    | 'guardianName'
    | 'guardianPhoneNumber'
    | 'address'
  > {
  confirmPassword: string;
  status?: UserStatus;
}
