import { Request, Response } from '../../utils/interfaces/express.interface';
import { ISchoolDocument, ISchoolRegisterBody, ISchoolUpdateBody } from './utils/school.interface';
import { SchoolModel } from './school.model';
import HTTP_STATUS from 'http-status-codes';
import Paginator from '../../utils/helpers/pagination';
import { getSchoolById, getSchoolBySubdomain, updateSchoolById } from './school.service';
import { Types } from 'mongoose';
import { getActiveUserById } from '../user/user.service';
import { UserRoles } from '../user/utils/user.enum';
import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { SchoolStatus } from './utils/school.enum';
import { SuccessMessages } from '../../utils/enums/success-messages.enum';

/**
 * Creates a new school with the provided information.
 *
 * @param {Request<ISchoolRegisterBody>} req - The request object containing the school information.
 * @param {Response} res - The response object used to send the created school as a JSON response.
 * @returns {Promise<ISchoolResponse>} A promise that resolves when the school is created and saved successfully.
 * @throws {BadRequestError} If a school with the specified subdomain already exists.
 */
export const createSchool = async (req: Request<ISchoolRegisterBody>, res: Response): Promise<void> => {
  const { subdomain, ...newSchool } = req.body;

  const existingSchool = await getSchoolBySubdomain(subdomain);

  if (existingSchool) throw new BadRequestError(ErrorMessages.SubdomainAlreadyExists);

  const school = await SchoolModel.create({ ...newSchool, subdomain });

  await school.save();

  res
    .status(HTTP_STATUS.CREATED)
    .json({ ...school, studentsCount: 0, coursesCount: 0, teachersCount: 0, staffsCount: 0 });
};

/**
 * Updates a school with new information.
 *
 * @async
 * @param {Request<ISchoolUpdateBody>} req - The request object containing the school update information.
 * @param {Response} res - The response object used to send the updated school information.
 * @returns {Promise<void>} A promise that resolves once the school is updated.
 * @throws {NotFoundError} - If the school is not found or has been deleted.
 */
export const updateSchool = async (req: Request<ISchoolUpdateBody>, res: Response): Promise<void> => {
  const { id } = req.params;
  const schoolId = new Types.ObjectId(id);

  const { address, name, phoneNumber, logo, status } = req.body;

  const existingSchool = await getSchoolById(schoolId);

  if (!existingSchool || existingSchool.status === SchoolStatus.Deleted)
    throw new NotFoundError(ErrorMessages.SchoolNotFound);

  const updatingSchool: ISchoolDocument = {
    name: name || existingSchool.name,
    phoneNumber: phoneNumber || existingSchool.phoneNumber,
    address: address || existingSchool.address,
    logo: logo || existingSchool.logo,
    status: status || existingSchool.status,
  } as ISchoolDocument;

  const updatedSchool = await updateSchoolById(existingSchool._id, updatingSchool);

  if (!updatedSchool) throw new BadRequestError(ErrorMessages.SomethingWentWrong);

  res.status(HTTP_STATUS.OK).json({ message: SuccessMessages.UpdatedSuccessfully });
};

/**
 * Assigns a director to a school.
 *
 * @param {Request<{ userId: string }>} req - The request object containing the user ID.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the director is assigned to the school.
 * @throws {NotFoundError} - If the school is not found or has been deleted.
 * @throws {BadRequestError} - If the user's role is not ADMIN.
 */
export const assignDirectorSchool = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  const { userId } = req.body;
  const { id } = req.params;

  const userObjectId = new Types.ObjectId(userId);

  const schoolObjectId = new Types.ObjectId(id);

  const school = await getSchoolById(schoolObjectId);

  if (!school || school.status === SchoolStatus.Deleted) throw new NotFoundError(ErrorMessages.SchoolNotFound);

  const user = await getActiveUserById(userObjectId);

  if (user.role !== UserRoles.ADMIN) throw new BadRequestError(ErrorMessages.DirectorRoleMustBeAdmin);

  const updatingSchool = {
    directorId: user.id,
  } as ISchoolDocument;

  const updatedSchool = await updateSchoolById(school._id, updatingSchool);

  if (!updatedSchool) throw new BadRequestError(ErrorMessages.SomethingWentWrong);

  res.status(HTTP_STATUS.OK).json({ message: SuccessMessages.UpdatedSuccessfully });
};

/**
 * Retrieves paginated schools based on the provided request parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 *
 * @returns {Promise<ISchoolResponse[]>} - A promise that resolves when the schools are retrieved and the response is sent.
 */
export const getSchools = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  const schools = new Paginator<ISchoolDocument>(SchoolModel, { page, limit });

  const paginatedSchools = await schools.paginate();

  // TODO: Student, Courses, Teachers, Staffs collectionlari qilinganda real datalar bilan qo'shib ketish kerak
  const fakeCountData = paginatedSchools.data.map(school => {
    return { ...school.toJSON(), studentsCount: 0, coursesCount: 0, teachersCount: 0, staffsCount: 0 };
  });

  res.status(HTTP_STATUS.OK).json({ ...paginatedSchools, data: fakeCountData });
};

/**
 * Retrieves an active school object by its ID and sends it as a JSON response.
 *
 * @param {Request} req - The Request object.
 * @param {Response} res - The Response object.
 * @returns {Promise<ISchoolResponse>} A Promise that resolves once the school object is sent.
 *
 * @throws {Error} If an error occurs while retrieving the school object.
 * @throws {TypeError} If the school ID is not valid.
 */
export const getSchool = async (req: Request, res: Response): Promise<void> => {
  const schoolId = req.params.id;
  const schoolObjectId = new Types.ObjectId(schoolId);

  const school = await getSchoolById(schoolObjectId);

  if (!school) throw new NotFoundError(ErrorMessages.SchoolNotFound);
  if (school.status === SchoolStatus.Deleted) throw new NotFoundError(ErrorMessages.SchoolNotFound);
  if (school.status === SchoolStatus.Inactive) throw new NotFoundError(ErrorMessages.SchoolInactive);

  res.status(HTTP_STATUS.OK).json({ ...school, studentsCount: 0, coursesCount: 0, teachersCount: 0, staffsCount: 0 });
};

/**
 * Retrieves paginated users based on the provided request parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves when the users are retrieved and the response is sent.
 */
// TODO: Users collection qilinganda tugatib qo'yich kerak
export const getUsersBySchoolId = async (req: Request, res: Response): Promise<any> => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  res
    .status(HTTP_STATUS.OK)
    .json({ data: [], totalData: 0, totalPages: 0, page: page, limit: limit, hasNextPage: false, hasPrevPage: false });
};

/**
 * Retrieves paginated courses based on the provided request parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves when the courses are retrieved and the response is sent.
 */
// TODO: Courses collection qilinganda tugatib qo'yich kerak
export const getCoursesBySchoolId = async (req: Request, res: Response): Promise<any> => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  res
    .status(HTTP_STATUS.OK)
    .json({ data: [], totalData: 0, totalPages: 0, page: page, limit: limit, hasNextPage: false, hasPrevPage: false });
};
