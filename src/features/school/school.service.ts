import { ObjectId } from 'mongodb';
import { SchoolModel } from './school.model';
import { ISchoolDocument, ISchoolResponse } from './utils/school.interface';
import { getDocumentFromCache, removeCachedDocument } from '../../configs/redis.config';

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
      $unwind: '$director',
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

  await removeCachedDocument(`school:id:${id}`);
  return updatedSchool;
};
