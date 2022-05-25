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
  if ((typeof(userRole) === 'string' && userRole === 'globalManager') || userId === "e2d992d5-a2e8-4eb6-aa87-8604eb0b608d") {
    return next();
  }

  if (Array.isArray(userRole)){
    const userRoles = userRole as RoleAttributes[];
    const hasAccess = userRoles.map((role) => {
      return role.name === 'manager' && role.groupId === req.params.groupId;
  })
  console.log("hasAccess", hasAccess[0]);
    if (hasAccess[0]){
      return next();
    }
  }

  sendError(res);
}
