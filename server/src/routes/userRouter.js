import { Router } from "express";
import userApiController from "../controllers/userApiController.js";
import { checkAuthorization } from "../helpers/middleware.js";
const router = Router();

router.get("/", userApiController.getAll);
router.get("/:userId", userApiController.getById);
router.post(
    "/check-password",
    checkAuthorization,
    userApiController.checkPassword
);
router.patch(
    "/change-password",
    checkAuthorization,
    userApiController.changePassword
);
export default router;
