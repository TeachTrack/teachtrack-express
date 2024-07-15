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
  courseIds: ObjectId[];
  schoolIds: ObjectId[];
  guardianName: string | undefined;
  guardianPhoneNumber: string | undefined;
  address: string | undefined;
  salary: number | undefined;
  birthday: Date | undefined;
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
    | 'salary'
    | 'birthday'
  > {
  confirmPassword: string;
  schoolSubdomain: string;
  status?: UserStatus;
}
