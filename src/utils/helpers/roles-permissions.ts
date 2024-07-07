import { UserRoles } from '../../features/user/utils/user.enum';

export const roleHierarchy: { [key in UserRoles]: number } = {
  [UserRoles.SUPER_ADMIN]: 5,
  [UserRoles.ADMIN]: 4,
  [UserRoles.STAFF]: 3,
  [UserRoles.TEACHER]: 2,
  [UserRoles.STUDENT]: 1,
  [UserRoles.GUARDIAN]: 1,
};

export const userCreateRolePermissions: { [key in UserRoles]: UserRoles[] } = {
  [UserRoles.SUPER_ADMIN]: [
    UserRoles.ADMIN,
    UserRoles.SUPER_ADMIN,
    UserRoles.STAFF,
    UserRoles.TEACHER,
    UserRoles.STUDENT,
    UserRoles.GUARDIAN,
  ],
  [UserRoles.ADMIN]: [UserRoles.STAFF, UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.GUARDIAN],
  [UserRoles.STAFF]: [UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.GUARDIAN],
  [UserRoles.TEACHER]: [],
  [UserRoles.STUDENT]: [],
  [UserRoles.GUARDIAN]: [],
};
