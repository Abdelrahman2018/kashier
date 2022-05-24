import { BaseError, ServerError } from "../../errors";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../lib";

export default function baseErrorHandler(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let errorResponse: any = {};

  if (error.errors && !res.headersSent) {
    errorResponse = {
      message: error.message,
      status: error.status,
      errors: error.errors,
    };
  } else if (error && error.name === "SequelizeValidationError") {
    errorResponse.status = 422;
    errorResponse.message = "SQL validation error";
    errorResponse.errors = error.errors.map((err) => {
      return {
        message: err.message,
        attribute: err.path,
        value: err.value,
        type: err.type,
      };
    });
  } else if (error && error.name === "SequelizeUniqueConstraintError") {
    console.log(11111111);

    errorResponse = {
      status: 422,
      message: error.errors[0].message,
      attribute: error.errors[0].path,
      value: error.errors[0].value,
      type: error.errors[0].type,
    };
  } else if (error && error.name === "SequelizeForeignKeyConstratintError") {
    // TODO: handle SequelizeForeignKeyConstratintError
    errorResponse.status = 422;
  } else if (error && error.name === "SequelizeForeignKeyConstraintError") {
    errorResponse.status = 404;
    errorResponse.message = `${error.fields[0].split("_")[0]} does not exist`;
  } else {
    errorResponse = new ServerError();
  }

  logger.error(error);
  res.status(errorResponse.status).json(errorResponse);
}

// TODO: handle rest of Sequelize errors
// SequelizeValidationError
// SequelizeDatabaseError
// SequelizeTimeoutError
// SequelizeUniqueConstraintError
//
// SequelizeExclusionConstraintError
// SequelizeConnectionError
// SequelizeConnectionRefusedError
// SequelizeHostNotFoundError
// SequelizeHostNotReachableError
// SequelizeInstanceError
