import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { Request, Response } from '../../utils/interfaces/express.interface';
import { UserStatus } from './utils/user.enum';
import { ILoginUserBody, IRegisterUserBody, IUpdateUserBody, IUserDocument } from './utils/user.interface';
import { getActiveUserById, getUserById, getUserByIdAndUpdate, getUserByPhoneNumberAndSchoolId } from './user.service';
import HTTP_STATUS from 'http-status-codes';
import { generateToken } from './utils/user.utils';
import Paginator from '../../utils/helpers/pagination';
import { UserModel } from './user.model';
import { Types } from 'mongoose';
import { getDocumentFromCache } from '../../configs/redis.config';
import { SuccessMessages } from '../../utils/enums/success-messages.enum';
import { ObjectId } from 'mongodb';

/**
 * Log in a user.
 *
 * @async
 * @param {Request<ILoginUserBody>} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is logged in.
 * @throws {NotFoundError} - If the user does not exist or is deleted.
 * @throws {BadRequestError} - If the credentials are invalid or the user is inactive.
 */
export const loginUserController = async (req: Request<ILoginUserBody>, res: Response): Promise<void> => {
  const { password, phoneNumber } = req.body;
  const schoolId = req.school?.id as ObjectId;

  const existingUser = await getUserByPhoneNumberAndSchoolId(phoneNumber, schoolId);

  const isUserBelongToSchool = existingUser?.schoolId.toString() === req.school?.id.toString();

  if (!existingUser || existingUser.status === UserStatus.DELETED || !isUserBelongToSchool)
    throw new NotFoundError(ErrorMessages.UserNotFound);

  const isPasswordMatched = await existingUser.comparePassword(password);

  if (!isPasswordMatched) throw new BadRequestError(ErrorMessages.InvalidCredentials);

  if (existingUser.status === UserStatus.INACTIVE) throw new BadRequestError(ErrorMessages.UserInactive);

  const token = generateToken(existingUser);

  res.status(HTTP_STATUS.OK).json({ user: existingUser, token });
};

/**
 * Register a new user with the given request and response objects.
 *
 * @async
 * @param {Request<IRegisterUserBody>} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves to undefined.
 * @throws {BadRequestError} If the user already exists or if the passwords do not match.
 */
export const registerUserController = async (req: Request<IRegisterUserBody>, res: Response): Promise<void> => {
  const { confirmPassword, password, phoneNumber, ...body } = req.body;
  const schoolId = req.school?.id as ObjectId;

  const creatingUser = await getUserByPhoneNumberAndSchoolId(phoneNumber, schoolId);

  if (!!creatingUser) throw new BadRequestError(ErrorMessages.UserAlreadyExists);

  if (password !== confirmPassword) throw new BadRequestError(ErrorMessages.PasswordMismatch);

  const newUser: IUserDocument = {
    phoneNumber,
    password,
    schoolId,
    ...body,
  } as IUserDocument;

  const user = await UserModel.create(newUser);

  await user.save();

  const token = generateToken(user);

  res.status(HTTP_STATUS.CREATED).json({ user, token });
};

/**
 * Get user controller.
 *
 * @function getUserController
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getUserController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const id = new Types.ObjectId(userId);

  const user = await getDocumentFromCache<IUserDocument>(`user:id:${userId}`, getActiveUserById.bind(null, id));

  res.status(HTTP_STATUS.OK).json(user);
};

/**
 * Retrieves staffs based on provided query parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - Resolves after successful execution.
 */
export const getStaffsController = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;
  const searchText = req.query.search as string | undefined;
  const searchRegex = new RegExp(searchText || '', 'i');
  const role = req.query.role as string | undefined;

  const paginator = new Paginator<IUserDocument>(
    UserModel,
    { page, limit },
    { role: role, $or: [{ phoneNumber: searchRegex }, { fullName: searchRegex }] },
  );

  const paginatedUsers = await paginator.paginate();

  res.status(HTTP_STATUS.OK).json(paginatedUsers);
};

/**
 * Retrieves an active user by their ID and sends the user object as JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves once the user object is sent as JSON response.
 */
export const getMeController = async (req: Request, res: Response): Promise<void> => {
  const userId = req?.user?._id;
  const objectUserId = new Types.ObjectId(userId);
  const user = await getActiveUserById(objectUserId);
  res.status(HTTP_STATUS.OK).json(user);
};

/**
 * Updates a user with the provided information.
 *
 * @param {Request<IUpdateUserBody>} req - The request object containing the updated user information.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves to void.
 * @throws {NotFoundError} - If the user with the given userId is not found.
 * @throws {BadRequestError} - If something went wrong while updating the user.
 */
export const updateUser = async (req: Request<IUpdateUserBody>, res: Response): Promise<void> => {
  let {
    password,
    phoneNumber,
    guardianPhoneNumber,
    guardianName,
    fullName,
    role,
    status,
    gender,
    salary,
    birthday,
    address,
    confirmPassword,
  } = req.body;

  const userId = req.params.userId;
  const userObjectId = new Types.ObjectId(userId);

  const existingUser = await getUserById(userObjectId);

  if (!existingUser) throw new NotFoundError(ErrorMessages.UserNotFound);

  if (password && password === confirmPassword) {
    password = await existingUser.hashPassword(password);
  }

  const userBody = {
    password: password || existingUser.password,
    phoneNumber: phoneNumber || existingUser.phoneNumber,
    guardianPhoneNumber: guardianPhoneNumber || existingUser.guardianPhoneNumber,
    guardianName: guardianName || existingUser.guardianName,
    fullName: fullName || existingUser.fullName,
    role: role || existingUser.role,
    status: status || existingUser.status,
    gender: gender || existingUser.status,
    salary: salary || existingUser.salary,
    birthday: birthday || existingUser.birthday,
    address: address || existingUser.birthday,
  } as IUserDocument;

  const newUser = await getUserByIdAndUpdate(userObjectId, userBody);

  if (!newUser) throw new BadRequestError(ErrorMessages.SomethingWentWrong);

  res.status(HTTP_STATUS.OK).json({ message: SuccessMessages.UpdatedSuccessfully });
};
