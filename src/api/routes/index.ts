import userRouter from "./user";
import groupRouter from "./group";
import collectionRouter from "./collection";
import itemRouter from "./item";
import adminRouter from "./admins";
import * as express from "express"


const router = express.Router();

router.use("/group", userRouter);
router.use("/group", groupRouter);
router.use("/group", collectionRouter);
router.use("/group", itemRouter);
router.use("/", adminRouter);

export default router;
