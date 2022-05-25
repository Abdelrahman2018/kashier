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

router.get("/user", 
isAuthenticated,
paginate, 
hasAccess,
UserController.findAll
);

router.get("/user/:id", 
isAuthenticated,
hasAccess,
UserController.getUser
);

router.post("/user", 
validate(CreateUserDto), 
isAuthenticated,
hasAccess,
UserController.createUser
);


router.put("/user/:id",
isAuthenticated,
hasAccess,
UserController.updateUser
);

router.delete("/user/:id",
isAuthenticated,
hasAccess,
UserController.deleteUser
);



export default router;
