import { Router } from "express";
import authApiController from "../controllers/authApiController.js";

const router = Router();

router.post("/register", authApiController.register);
router.post("/login", authApiController.login);
router.post("/logout", authApiController.logout);
export default router;
