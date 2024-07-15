import mongoose, { Schema } from 'mongoose';
import { ISchoolDocument } from './utils/school.interface';
import { SchoolStatus } from './utils/school.enum';

const schoolModel: Schema = new Schema(
  {
    name: { type: String, require: true },
    phoneNumber: { type: String, require: true },
    address: { type: String, require: true },
    subdomain: { type: String, require: true, unique: true },
    status: { type: String, default: SchoolStatus.Inactive, enum: SchoolStatus },
    directorId: { type: Schema.Types.ObjectId, ref: 'Users', require: true },
    logo: { type: String },
  },
  { timestamps: true },
);

export const SchoolModel = mongoose.model<ISchoolDocument>('Schools', schoolModel);
