import userRouter from "./user";
import groupRouter from "./group";
import collectionRouter from "./collection";
import itemRouter from "./item";
import * as express from "express"


const router = express.Router();

router.use("/user", userRouter);
router.use("/group", groupRouter);
router.use("/collection", collectionRouter);
router.use("/item", itemRouter);

export default router;
