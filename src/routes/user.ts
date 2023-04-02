import { Router } from "express";
import { body } from "express-validator/check";
import * as userController from "../controllers/user";

const router = Router();

router.get("/all-users", userController.getAllUsers);

export default router;
