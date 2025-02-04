import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import apiRouter from "./apiRouter.js";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/api", apiRouter);

export default router;