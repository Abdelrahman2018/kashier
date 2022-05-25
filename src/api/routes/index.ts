import userRouter from "./user";
import groupRouter from "./group";
import collectionRouter from "./collection";
import itemRouter from "./item";
import * as express from "express"


const router = express.Router();

router.use("/user", userRouter);
// router.use("/group", groupRouter);
router.use("/group/:groupId/collection", collectionRouter);
router.use("/group/:groupId/collection/:collectionId/item", itemRouter);

export default router;
