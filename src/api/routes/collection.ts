import { Router } from "express";
import { CreateCollectionDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  // isGlobalManagerMiddleware as isGlobalManager,
  hasAccessMiddleware as hasAccess,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { CollectionController } from "../controllers";

const router = Router();

router.get("/", 
paginate,
isAuthenticated, 
hasAccess,
CollectionController.findAll
);

router.get("/:id",
isAuthenticated, 
hasAccess,
CollectionController.getCollection
);

router.post("/", 
validate(CreateCollectionDto), 
isAuthenticated, 
hasAccess,
CollectionController.createCollection
);

router.put("/:id",
isAuthenticated, 
hasAccess,
CollectionController.updateCollection
);

router.delete("/:id",
isAuthenticated, 
hasAccess,
CollectionController.deleteCollection
);

export default router;
