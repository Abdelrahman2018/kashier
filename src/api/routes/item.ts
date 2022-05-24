import { Router } from "express";
import { CreateItemDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  // isAdminMiddleware as isAdmin,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { ItemController } from "../controllers";

const router = Router();

router.get("/", paginate, ItemController.findAll);

router.get("/:id", ItemController.getItem);

router.post("/", 
validate(CreateItemDto), 
// isAuthenticated,
// isAdmin,
ItemController.createItem
);

router.put("/:id",
// isAuthenticated,
// isAdmin,
ItemController.updateItem
);

router.delete("/:id",
// isAuthenticated,
// isAdmin,
ItemController.deleteItem
);



export default router;
