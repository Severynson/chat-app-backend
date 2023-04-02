import { Router } from "express";
import { body } from "express-validator/check";
import User from "../models/user";
import * as authController from "../controllers/auth";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password is too short!"),
  ],
  authController.login
);

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value: string, { req }: { req: any }): Promise<any> => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password is too short!"),
    body("name").trim().not().isEmpty().withMessage("Username can't be empty!"),
  ],
  authController.signup
);

export default router;
