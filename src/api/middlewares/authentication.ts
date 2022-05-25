import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import config from "../../config";

const sendError = (res: Response) => {
  res.status(401).json({ errors: [{ message: 'unauthorized' }] });
};

export default function authorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // console.log(req.headers.authorization);
    if (!req.headers.authorization && !req.headers.userid) {
      console.log("headers",req.headers)
      console.log('no auth header');
      return sendError(res);
    }
    if(req.headers.authorization){
      const token: string = req.headers.authorization as string;
      const isValid = JWT.verify(token, config.JWT_ACCESS_SECRET as string);
      if (!isValid) {
        console.log('invalid token');
        return sendError(res);
      }
  
      const user = JWT.decode(token, { json: true });
      console.log("user", user);
      if (!user) {
        console.log('no user');
        return sendError(res);
      }
  
      //   success , inject user id and user type for the next middleware/controller
      req.headers.userId = user.sub;
      req.headers.role = user.role;
      req.body.groupId = req.params.groupId
      req.body.collectionId = req.params.collectionId
    }

    if(req.headers.userid){
      req.headers.userId = req.headers.userid
    }

  
    // req.body.prevRoles = user.role;

    // console.log('paras', req.params);

    // no error, ok .. to the next step 🚀🚀🚀
    return next();
  } catch (e) {
    console.log((e as Error).message);
    return sendError(res);
  }
}
