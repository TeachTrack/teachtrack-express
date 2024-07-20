import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { SchoolStatus } from './school.enum';
import { IUserDocument } from '../../user/utils/user.interface';

export interface ISchoolDocument extends Document {
  _id: ObjectId;
  name: string;
  phoneNumber: string;
  address: string;
  subdomain: string;
  status: SchoolStatus;
  directorId: ObjectId;
  price: string;
  logo?: string;
}

export interface ISchoolRegisterBody
  extends Pick<ISchoolDocument, 'name' | 'phoneNumber' | 'address' | 'logo' | 'subdomain' | 'price'> {
  directorId?: string;
}

export interface ISchoolUpdateBody {
  name?: string;
  phoneNumber?: string;
  address?: string;
  logo?: string;
  status?: SchoolStatus;
}

export interface ISchoolResponse
  extends Pick<
    ISchoolDocument,
    '_id' | 'name' | 'phoneNumber' | 'address' | 'subdomain' | 'status' | 'price' | 'logo'
  > {
  director: {
    _id: ObjectId;
    fullName: IUserDocument['fullName'];
    phoneNumber: IUserDocument['phoneNumber'];
  };
}
