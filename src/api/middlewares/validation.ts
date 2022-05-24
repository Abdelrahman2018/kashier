import { RequestHandler, Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ValidationError as ValidationException } from "../../errors";
// import { Messages } from "../../localization";

export default function validationMiddleware<T>(type: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const validationErrors = errors.map((error: ValidationError) => {
          // Only return the first error for each field
          const msgKey = Object.values(error.constraints || {})[0];

          return {
            field: error.property,
            // message: Messages["ar"][msgKey],
          };
        });
        next(new ValidationException(validationErrors));
      } else {
        next();
      }
    });
  };
}
