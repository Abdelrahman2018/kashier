import { Router } from "express";
import { CreateCollectionDto } from "../../dto";
import {
  paginateMiddleware as paginate,
  validateMiddleware as validate,
  // isAdminMiddleware as isAdmin,
  authenticationMiddleware as isAuthenticated,
} from "../middlewares";
import { CollectionController } from "../controllers";

const router = Router();

router.get("/", paginate, CollectionController.findAll);

router.get("/:id", CollectionController.getCollection);

router.post("/", 
validate(CreateCollectionDto), 
// isAuthenticated,
// isAdmin,
CollectionController.createCollection
);

router.put("/:id",
// isAuthenticated,
// isAdmin,
CollectionController.updateCollection
);

router.delete("/:id",
// isAuthenticated,
// isAdmin,
CollectionController.deleteCollection
);



export default router;
