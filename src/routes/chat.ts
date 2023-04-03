import { Router } from "express";
import * as chatController from "../controllers/chat";
import { isAuth } from "../middleware/is-auth";

const router = Router();

router.post("/", isAuth, chatController.getChat);

router.post("/send-message", isAuth, chatController.sendMessage);

export default router;
