import { Request, Response } from '../../utils/interfaces/express.interface';
import { ISchoolDocument, ISchoolRegisterBody, ISchoolUpdateBody } from './utils/school.interface';
import { SchoolModel } from './school.model';
import HTTP_STATUS from 'http-status-codes';
import Paginator from '../../utils/helpers/pagination';
import { getActiveSchoolById, getSchoolById, getSchoolBySubdomain, updateSchoolById } from './school.service';
import { Types } from 'mongoose';
import { getActiveUserById } from '../user/user.service';
import { UserRoles } from '../user/utils/user.enum';
import { BadRequestError, NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { SchoolStatus } from './utils/school.enum';

export const createSchool = async (req: Request<ISchoolRegisterBody>, res: Response): Promise<void> => {
  const { subdomain, ...newSchool } = req.body;

  const existingSchool = await getSchoolBySubdomain(subdomain);

  if (existingSchool) throw new BadRequestError(ErrorMessages.SubdomainAlreadyExists);

  const school = await SchoolModel.create({ ...newSchool, subdomain, directorId: null });

  await school.save();

  res.status(HTTP_STATUS.CREATED).json(school);
};

export const updateSchool = async (req: Request<ISchoolUpdateBody>, res: Response): Promise<void> => {
  // Todo: validatsiya qo'shish
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

  const updatedSchool = await updateSchoolById(existingSchool.id, updatingSchool);

  res.status(HTTP_STATUS.OK).json(updatedSchool);
};

export const assignDirectorSchool = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  // Todo: validatsiya qo'shish

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

  const updatedSchool = await updateSchoolById(school.id, updatingSchool);

  res.status(HTTP_STATUS.OK).json(updatedSchool);
};

export const getSchools = async (req: Request, res: Response): Promise<void> => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  const schools = new Paginator<ISchoolDocument>(SchoolModel, { page, limit });

  const paginatedSchools = await schools.paginate();

  res.status(HTTP_STATUS.OK).json(paginatedSchools);
};

export const getSchool = async (req: Request, res: Response): Promise<void> => {
  const schoolId = req.params.id;
  const schooObjectId = new Types.ObjectId(schoolId);

  const school = await getActiveSchoolById(schooObjectId);

  res.status(HTTP_STATUS.OK).json(school);
};
