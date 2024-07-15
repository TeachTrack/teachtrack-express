import * as Joi from "joi"
import { ObjectSchema } from 'joi';
import { IRegisterUserBody } from './utils/user.interface';
import { UserGender, UserRoles, UserStatus } from './utils/user.enum';

export const loginValidator: ObjectSchema = Joi.object().keys({
  phoneNumber: Joi.string().pattern(/^\+998\d{9}$/).required(),
  password: Joi.string().min(6).max(128).required()
})

export const registerValidator = Joi.object<IRegisterUserBody>({
  fullName: Joi.string().min(1).max(100).required(),
  phoneNumber: Joi.string().pattern(/^\+998\d{9}$/).required(),
  role: Joi.string().valid(...Object.values(UserRoles)).required(),
  gender: Joi.string().valid(...Object.values(UserGender)).required(),
  age: Joi.number().integer().min(1).max(120).required(),
  password: Joi.string().min(6).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
  status: Joi.string().valid(...Object.values(UserStatus)).optional(),
  guardianName: Joi.string().min(1).max(100).optional(),
  guardianPhoneNumber: Joi.string().pattern(/^\+998\d{9}$/).optional(),
  address: Joi.string().min(1).max(200).optional(),
  salary: Joi.number().min(0).optional(),
  birthday: Joi.date().optional(),
});