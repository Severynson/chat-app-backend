import { Router } from "express";
import * as authController from "../controllers/auth";
import {
  loginValidation,
  signupValidation,
} from "../middleware/auth-validation";

const router = Router();

router.post("/login", loginValidation(), authController.login);

router.put("/signup", signupValidation(), authController.signup);

export default router;
