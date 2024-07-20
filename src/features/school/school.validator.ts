import * as Joi from 'joi';
import { SchoolStatus } from './utils/school.enum';
import { ObjectSchema } from 'joi';

export const createSchoolValidator: ObjectSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+998\d{9}$/)
    .required(), // Example pattern for international phone numbers
  address: Joi.string().min(1).max(200).required(),
  subdomain: Joi.string()
    .pattern(/^[a-zA-Z0-9-]+$/)
    .min(1)
    .max(63)
    .required(), // Subdomain validation
  logo: Joi.string().uri().optional(),
  price: Joi.number().required(),
});

export const updateSchoolValidator: ObjectSchema = Joi.object().keys({
  name: Joi.string().min(1).max(100).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+998\d{9}$/)
    .optional(), // Example pattern for international phone numbers
  address: Joi.string().min(1).max(200).optional(),
  logo: Joi.string().uri().optional(),
  status: Joi.string()
    .valid(...Object.values(SchoolStatus))
    .optional(),
});

export const assignDirectorValidator: ObjectSchema = Joi.object().keys({
  userId: Joi.string().hex().length(24).required(),
});
