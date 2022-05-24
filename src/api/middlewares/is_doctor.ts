import { NextFunction, Request, Response } from "express";
// import { UserType } from "../../types/general";

const sendError = (res: Response) => {
  res.status(403).json({ errors: [{ message: "should be registered user" }] });
};

export default function doctorPermissions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // if (req.headers.user_id && req.headers.user_type === UserType.doctor) {
  //   req.headers.userId = req.headers.user_id;
  //   req.headers.userType = req.headers.user_type;
  //   return next();
  // }

  sendError(res);
}
