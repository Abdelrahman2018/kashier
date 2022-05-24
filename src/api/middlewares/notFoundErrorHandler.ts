import { NotFoundError } from '../../errors';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../lib';

/// catch 404 and forward to base error handler
export default function notFoundErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info(`${req.method}: ${req.path}`);
  next(new NotFoundError());
}
