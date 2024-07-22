import { Request, Response } from '../utils/interfaces/express.interface';
import { NextFunction } from 'express';
import { getSchoolBySubdomain } from '../features/school/school.service';
import HTTP_STATUS from 'http-status-codes';
import { ErrorMessages } from '../utils/enums/error-messages.enum';
import { SchoolStatus } from '../features/school/utils/school.enum';
import { UserRoles } from '../features/user/utils/user.enum';

export const schoolSubdomainRequired = async (req: Request, res: Response, next: NextFunction) => {
  const schoolSubdomain = req.subdomains[0];

  if (!schoolSubdomain) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ErrorMessages.SchoolNotFound });
  }

  const existingSchool = await getSchoolBySubdomain(schoolSubdomain);

  if (!existingSchool) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ErrorMessages.SchoolNotFound });
  }

  const isUserSuperAdmin = req.user?.role === UserRoles.SUPER_ADMIN;

  if (!isUserSuperAdmin) {
    const isAuthorized = !!req.user?.schoolId;

    if (isAuthorized && req.user?.schoolId !== existingSchool?._id.toString()) {
      return res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({ message: ErrorMessages.NoAccess });
    }

    if (existingSchool.status === SchoolStatus.Deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ErrorMessages.SchoolNotFound });
    }

    const isSchoolInActive = existingSchool.status === SchoolStatus.Inactive;

    if (isSchoolInActive) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ErrorMessages.SchoolInactive });
    }
  }

  req.school = {
    id: existingSchool._id,
    subdomain: existingSchool.subdomain,
  };

  next();
};
