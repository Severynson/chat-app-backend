import { Router } from "express";
import * as chatController from "../controllers/chat";

const router = Router();

router.post("/", chatController.getChat);

router.post("/send-message", chatController.sendMessage);

export default router;
