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
    console.log("groupId", req.body.groupId);
  if (Array.isArray(userRole)){
        const userRoles = userRole as RoleAttributes[];
        const hasAccess = userRoles.map((role) => {
        return role.name === 'manager' && role.groupId === req.body.groupId;
    })
    if (hasAccess.length){
      return next();
    }
    
  }

  sendError(res);
}
