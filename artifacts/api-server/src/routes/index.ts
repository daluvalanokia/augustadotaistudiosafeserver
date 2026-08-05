import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mergeSafeRouter from "./mergesafe";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mergeSafeRouter);

export default router;
