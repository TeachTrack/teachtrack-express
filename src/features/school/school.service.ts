import { ObjectId } from 'mongodb';
import { SchoolModel } from './school.model';
import { ISchoolDocument, ISchoolResponse } from './utils/school.interface';
import { getDocumentFromCache, removeCachedDocument } from '../../configs/redis.config';
import Paginator, { PaginatedResult, PaginateOptions } from '../../utils/helpers/pagination';
import { IUserDocument } from '../user/utils/user.interface';
import { UserModel } from '../user/user.model';

const populateDirectorForSchool = async (schoolId: ObjectId) => {
  const aggregation = (await SchoolModel.aggregate([
    { $match: { _id: schoolId } },
    {
      $lookup: {
        from: 'users',
        localField: 'directorId',
        foreignField: '_id',
        as: 'director',
      },
    },
    {
      $unwind: {
        path: '$director',
        preserveNullAndEmptyArrays: true, // This ensures the director field is included even if it's null
      },
    },
    {
      $addFields: {
        director: {
          $cond: {
            if: { $eq: ['$director', null] },
            then: {
              _id: null,
              fullName: null,
              phoneNumber: null,
            },
            else: '$director',
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            '$$ROOT',
            {
              director: {
                _id: '$director._id',
                fullName: '$director.fullName',
                phoneNumber: '$director.phoneNumber',
              },
            },
          ],
        },
      },
    },
  ])) as ISchoolResponse[];

  return aggregation[0];
};

export const getSchoolById = async (id: ObjectId): Promise<ISchoolResponse | undefined> => {
  const cacheKey = `school:id:${id.toString()}`;
  const fetchFunction = async (): Promise<ISchoolResponse> => await populateDirectorForSchool(id);

  return await getDocumentFromCache<ISchoolResponse>(cacheKey, fetchFunction);
};

export const getSchoolBySubdomain = async (subdomain: string): Promise<ISchoolDocument | undefined> => {
  const cacheKey = `school:subdomain:${subdomain}`;
  const fetchFunction = async () => (await SchoolModel.findOne({ subdomain })) as ISchoolDocument | undefined;

  return await getDocumentFromCache<ISchoolDocument>(cacheKey, fetchFunction);
};

export const updateSchoolById = async (id: ObjectId, school: ISchoolDocument): Promise<ISchoolDocument> => {
  const updatedSchool = (await SchoolModel.findByIdAndUpdate(id, school, { new: true })) as ISchoolDocument;

  const keysToRemove = [`school:id:${id}`, `school:subdomain:${updatedSchool.subdomain}`, `users:school:id:${id}`];

  keysToRemove.forEach(removeCachedDocument);
  return updatedSchool;
};

export const getPaginatedUsersBySchoolId = async (
  id: ObjectId,
  options: PaginateOptions,
): Promise<PaginatedResult<IUserDocument>> => {
  const users = new Paginator<IUserDocument>(UserModel, options, { schoolId: id });

  const fetcher = async () => await users.paginate();

  const cacheKey = `users:school:id:${id.toString()}`;

  return (await getDocumentFromCache<PaginatedResult<IUserDocument>>(
    cacheKey,
    fetcher,
  )) as PaginatedResult<IUserDocument>;
};
