import { Router } from "express";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
export default router;
