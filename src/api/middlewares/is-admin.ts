// import { NextFunction, Request, Response } from 'express';
// import { UserType } from '../../types/general';

// const sendError = (res: Response) => {
//   res.status(403).json({ errors: [{ message: 'should be an admin' }] });
// };

// export default function adminPermissions(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.headers.userType === UserType.admin) {
//     return next();
//   }

//   sendError(res);
// }
