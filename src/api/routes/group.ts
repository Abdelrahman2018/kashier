import { Router } from "express";
import { CreateGroupDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  hasAccessMiddleware as hasAccess,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { GroupController } from "../controllers";

const router = Router();

router.get("/", 
isAuthenticated,
hasAccess,
paginate, GroupController.findAll
);

router.get("/:id", 
isAuthenticated,
hasAccess,
GroupController.getGroup
);

router.post("/", 
validate(CreateGroupDto), 
isAuthenticated,
hasAccess,
GroupController.createGroup
);

router.put("/:id",
isAuthenticated,
hasAccess,
GroupController.updateGroup
);

router.delete("/:id",
isAuthenticated,
hasAccess,
GroupController.deleteGroup
);



export default router;
