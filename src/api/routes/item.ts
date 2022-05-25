import { Router } from "express";
import { CreateItemDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  isGroupManagerMiddleware as hasAccess,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { ItemController } from "../controllers";

const router = Router();

router.get("/:groupId/collection/:collectionId/item/",
 paginate, 
 isAuthenticated,
 hasAccess,
 ItemController.findAll
 );

router.get("/:groupId/collection/:collectionId/item/:id",
isAuthenticated,
 hasAccess,
 ItemController.getItem
);

router.post("/:groupId/collection/:collectionId/item", 
validate(CreateItemDto), 
isAuthenticated,
hasAccess,
ItemController.createItem
);

router.put("/:groupId/collection/:collectionId/item/:id",
isAuthenticated,
 hasAccess,
ItemController.updateItem
);

router.delete("/:groupId/collection/:collectionId/item/:id",
isAuthenticated,
 hasAccess,
ItemController.deleteItem
);



export default router;
