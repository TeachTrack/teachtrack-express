import HTTP_STATUS from "http-status-codes";
import { IError } from "../utils/interfaces/error-handler.interface";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  public validationError?: string;
  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    const errorBody: IError = {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };

    if (this.validationError) {
      errorBody.validationError = this.validationError;
    }

    return errorBody;
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = "error";
  validationError: string;

  constructor(message: string, validationError: string) {
    super(message);
    this.validationError = validationError;
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}
