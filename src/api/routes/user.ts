import { Router } from "express";
import { CreateUserDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  // isAdminMiddleware as isAdmin,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { UserController } from "../controllers";

const router = Router();

router.get("/", paginate, UserController.findAll);

router.get("/:id", UserController.getUser);

router.post("/", 
validate(CreateUserDto), 
// isAuthenticated,
// isAdmin,
UserController.createUser
);

router.put("/:id",
// isAuthenticated,
// isAdmin,
UserController.updateUser
);

router.delete("/:id",
// isAuthenticated,
// isAdmin,
UserController.deleteUser
);



export default router;
