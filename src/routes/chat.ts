import { Router } from "express";
import * as chatController from "../controllers/chat";
import { messageValidation } from "../middleware/chat-validation";
import { isAuth } from "../middleware/is-auth";

const router = Router();

router.post("/", isAuth, chatController.getChat);

router.post(
  "/send-message",
  isAuth,
  messageValidation(),
  chatController.sendMessage
);

export default router;
