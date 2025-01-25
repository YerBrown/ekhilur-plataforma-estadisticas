import { Router } from "express";
import userApiController from "../controllers/userApiController.js";

const router = Router();

router.get("/", userApiController.getAll);
export default router;
