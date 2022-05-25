import { Router } from "express";
import { CreateCollectionDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  hasAccessMiddleware as hasAccess,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { CollectionController } from "../controllers";

const router = Router();

router.get("/:groupId/collection", 
paginate,
isAuthenticated, 
hasAccess,
CollectionController.findAll
);

router.get("/:groupId/collection/:id",
isAuthenticated, 
hasAccess,
CollectionController.getCollection
);

router.post("/:groupId/collection", 
validate(CreateCollectionDto), 
isAuthenticated, 
hasAccess,
CollectionController.createCollection
);

router.put("/:groupId/collection/:id",
isAuthenticated, 
hasAccess,
CollectionController.updateCollection
);

router.delete("/:groupId/collection/:id",
isAuthenticated, 
hasAccess,
CollectionController.deleteCollection
);

export default router;
