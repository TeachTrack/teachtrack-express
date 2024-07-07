import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { UserStatus } from './utils/user.enum';
import { IUserDocument } from './utils/user.interface';
import { UserModel } from './user.model';
import { ObjectId } from 'mongodb';

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<IUserDocument | undefined> => {
  const existingUser = (await UserModel.findOne({ phoneNumber })) as IUserDocument | undefined;

  return existingUser;
};

export const getActiveUserById = async (id: ObjectId): Promise<IUserDocument> => {
  const existingUser = (await UserModel.findById(id)) as IUserDocument | undefined;

  if (!existingUser || existingUser.status === UserStatus.DELETED) throw new NotFoundError(ErrorMessages.UserNotFoud);
  if (existingUser.status === UserStatus.INACTIVE) throw new BadRequestError(ErrorMessages.UserInactive);

  return existingUser;
};
