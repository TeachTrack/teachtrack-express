import { Request, Response } from '../interfaces/express.interface';
import { ObjectSchema } from 'joi';
import { ErrorMessages } from '../enums/error-messages.enum';
import { JoiRequestValidationError } from '../../middlewares/error-handler.middleware';
import { NextFunction } from 'express';

export const validator = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error?.details) {
      return next(new JoiRequestValidationError(ErrorMessages.VALIDATION_ERROR, error.details[0].message));
    }

    next();
  };
};

