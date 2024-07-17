import { ObjectId } from 'mongodb';
import { SchoolModel } from './school.model';
import { NotFoundError } from '../../middlewares/error-handler.middleware';
import { ErrorMessages } from '../../utils/enums/error-messages.enum';
import { ISchoolDocument } from './utils/school.interface';
import { SchoolStatus } from './utils/school.enum';
import { getDocumentFromCache } from '../../configs/redis.config';

export const getActiveSchoolById = async (id: ObjectId): Promise<ISchoolDocument> => {
  const school = (await SchoolModel.findById(id)) as ISchoolDocument;

  if (!school) throw new NotFoundError(ErrorMessages.SchoolNotFound);
  if (school.status === SchoolStatus.Deleted) throw new NotFoundError(ErrorMessages.SchoolNotFound);
  if (school.status === SchoolStatus.Inactive) throw new NotFoundError(ErrorMessages.SchoolInactive);

  return school;
};

export const getSchoolById = async (id: ObjectId): Promise<ISchoolDocument | undefined> => {
  const cacheKey = `school:id:${id.toString()}`;
  const fetchFunction = async () => (await SchoolModel.findById(id)) as ISchoolDocument;

  return await getDocumentFromCache<ISchoolDocument>(cacheKey, fetchFunction);
};

export const getSchoolBySubdomain = async (subdomain: string): Promise<ISchoolDocument | undefined> => {
  return (await SchoolModel.findOne({ subdomain })) as ISchoolDocument | undefined;
};

export const updateSchoolById = async (id: ObjectId, school: ISchoolDocument): Promise<ISchoolDocument> => {
  return (await SchoolModel.findByIdAndUpdate(id, school, { new: true })) as ISchoolDocument;
};
