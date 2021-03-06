import { Router } from "express";
import { CreateUserDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  hasAccessMiddleware as hasAccess,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { UserController } from "../controllers";

const router = Router();

router.get("/:groupId/user", 
isAuthenticated,
paginate, 
hasAccess,
UserController.findAll
);

router.get("/:groupId/user/:id", 
isAuthenticated,
hasAccess,
UserController.getUser
);

router.post("/:groupId/user", 
validate(CreateUserDto), 
isAuthenticated,
hasAccess,
UserController.createUser
);

router.put("/:groupId/user/:id",
isAuthenticated,
hasAccess,
UserController.updateUser
);

router.delete("/:groupId/user/:id",
isAuthenticated,
hasAccess,
UserController.deleteUser
);



export default router;
