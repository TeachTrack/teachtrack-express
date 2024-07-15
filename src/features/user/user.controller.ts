import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { Request, Response } from '../../utils/interfaces/express.interface';
import { UserStatus } from './utils/user.enum';
import { ILoginUserBody, IRegisterUserBody, IUserDocument } from './utils/user.interface';
import { getActiveUserById, getUserByPhoneNumber } from './user.service';
import HTTP_STATUS from 'http-status-codes';
import { generateToken } from './utils/user.utils';
import Paginator from '../../utils/helpers/pagination';
import { UserModel } from './user.model';
import { Types } from 'mongoose';

export const loginUserController = async (req: Request<ILoginUserBody>, res: Response): Promise<void> => {
  const { password, phoneNumber } = req.body;

  const existingUser = await getUserByPhoneNumber(phoneNumber);

  if (!existingUser || existingUser.status === UserStatus.DELETED) throw new NotFoundError(ErrorMessages.UserNotFoud);

  const isPasswordMatched = await existingUser.comparePassword(password);

  if (!isPasswordMatched) throw new BadRequestError(ErrorMessages.InvalidCredentials);

  if (existingUser.status === UserStatus.INACTIVE) throw new BadRequestError(ErrorMessages.UserInactive);

  const token = generateToken(existingUser);

  res.status(HTTP_STATUS.OK).json({ user: existingUser, token });
};

export const registerUserController = async (req: Request<IRegisterUserBody>, res: Response): Promise<void> => {
  const { confirmPassword, password, phoneNumber, schoolSubdomain, ...body } = req.body;

  const existingUser = await getUserByPhoneNumber(phoneNumber);

  if (existingUser) throw new BadRequestError(ErrorMessages.UserAlreadyExists);

  if (password !== confirmPassword) throw new BadRequestError(ErrorMessages.PasswordMismatch);

  const newUser: IUserDocument = {
    phoneNumber,
    password,
    ...body,
  } as IUserDocument;

  const user = await UserModel.create(newUser);

  await user.save();

  const token = generateToken(user);

  res.status(HTTP_STATUS.CREATED).json({ user, token });
};

export const getUserController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const id = new Types.ObjectId(userId);

  const user = await getActiveUserById(id);

  res.status(HTTP_STATUS.OK).json({ user });
};

export const getStaffsController = async (req: Request, res: Response): Promise<void> => {
  // TODO: User roliga qarab natija chiqarish
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
