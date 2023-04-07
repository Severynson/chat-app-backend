import { Router } from "express";
import { body } from "express-validator/check";
import * as userController from "../controllers/user";
import { isAuth } from "../middleware/is-auth";

const router = Router();

router.get(
  "/all-available-chatmates",
  isAuth,
  userController.allAvailableChatmates
);

export default router;
