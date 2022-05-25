import { NextFunction, Request, Response } from 'express';
import { RoleAttributes } from '../../types/models';

const sendError = (res: Response) => {
  res.status(403).json({ errors: [{ message: 'dosent have access to this route' }] });
};

export default function adminPermissions(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const userId = req.headers.userId as string;
    const userRole = req.headers.role as string | RoleAttributes[];
  if (typeof(userRole) === 'string' && userRole === 'globalManager') {
    return next();
  }

  if (Array.isArray(userRole)){
    const userRoles = userRole as RoleAttributes[];
    const hasAccess = userRoles.map((role) => {
      return role.name === 'manager' && role.groupId === req.params.groupId;
  })
  console.log("hasAccess", hasAccess[0]);
  // console.log("params", req.params.groupId);
    if (hasAccess[0]){
      return next();
    }
  }

  sendError(res);
}
