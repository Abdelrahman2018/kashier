import { Request, Response, NextFunction } from 'express';

export default function paginate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { page = 1, size = 10 } = req.query;

  page = +page;
  size = +size;

  req.body['limit'] = size;
  req.body['offset'] = size * (page - 1);

  next();
}
