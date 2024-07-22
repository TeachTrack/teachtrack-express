import mongoose, { Schema } from 'mongoose';
import { UserGender, UserRoles, UserStatus } from './utils/user.enum';
import { IUserDocument } from './utils/user.interface';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';

const userSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true, enum: UserRoles },
    status: { type: String, enum: UserStatus, default: UserStatus.INACTIVE },
    gender: { type: String, enum: UserGender, required: true },
    password: { type: String, required: true },
    guardianName: { type: String },
    guardianPhoneNumber: { type: String },
    schoolId: { type: Schema.Types.ObjectId, ref: 'Schools', required: true },
    courseIds: [{ type: Schema.Types.ObjectId, ref: 'Courses' }],
    address: { type: String },
    salary: { type: Number },
    birthday: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        delete ret.password;
      },
    },
  },
);

const SALT_ROUND = 10;

//@ts-ignore
userSchema.pre<IUserDocument>('save', async function (next: NextFunction) {
  const user = this;
  try {
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = async function (password: string) {
  return await bcrypt.hash(password, SALT_ROUND);
};

export const UserModel = mongoose.model<IUserDocument>('Users', userSchema);
