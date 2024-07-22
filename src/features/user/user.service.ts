import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { UserStatus } from './utils/user.enum';
import { IUserDocument } from './utils/user.interface';
import { UserModel } from './user.model';
import { ObjectId } from 'mongodb';
import { cacheDocument, getDocumentFromCache } from '../../configs/redis.config';

export const getUserByPhoneNumberAndSchoolId = async (
  phoneNumber: string,
  schoolId: ObjectId,
): Promise<IUserDocument | undefined> => {
  return (await UserModel.findOne({ phoneNumber, schoolId })) as IUserDocument | undefined;
};

export const getActiveUserById = async (id: ObjectId): Promise<IUserDocument> => {
  const existingUser = (await UserModel.findById(id)) as IUserDocument | undefined;

  if (!existingUser || existingUser.status === UserStatus.DELETED) throw new NotFoundError(ErrorMessages.UserNotFound);
  if (existingUser.status === UserStatus.INACTIVE) throw new BadRequestError(ErrorMessages.UserInactive);

  return existingUser;
};

export const getUserById = async (id: ObjectId): Promise<IUserDocument | undefined> => {
  const cacheKey = `user:id:${id.toString()}`;
  const fetcher = async () => (await UserModel.findById(id)) as unknown as IUserDocument;

  return getDocumentFromCache<IUserDocument>(cacheKey, fetcher);
};

export const getUserByIdAndUpdate = async (id: ObjectId, user: IUserDocument): Promise<IUserDocument | undefined> => {
  const cacheKey = `user:id:${id.toString()}`;
  const newUser = (await UserModel.findByIdAndUpdate(id, { user }, { new: true })) as IUserDocument | undefined;

  if (newUser) {
    await cacheDocument(cacheKey, newUser);
  }

  return newUser;
};
