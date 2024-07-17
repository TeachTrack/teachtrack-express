import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { SchoolStatus } from './school.enum';

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
