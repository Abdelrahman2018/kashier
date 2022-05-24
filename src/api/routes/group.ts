import { Router } from "express";
import { CreateGroupDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  // isAdminMiddleware as isAdmin,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { GroupController } from "../controllers";

const router = Router();

router.get("/", paginate, GroupController.findAll);

router.get("/:id", GroupController.getGroup);

router.post("/", 
validate(CreateGroupDto), 
// isAuthenticated,
// isAdmin,
GroupController.createGroup
);

router.put("/:id",
// isAuthenticated,
// isAdmin,
GroupController.updateGroup
);

router.delete("/:id",
// isAuthenticated,
// isAdmin,
GroupController.deleteGroup
);



export default router;
