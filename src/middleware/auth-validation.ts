import { body } from "express-validator/check";
import User from "../models/user";


export const loginValidation = () => [
  body("email").trim().isEmail().withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password is too short!"),
];

export const signupValidation = () => [
  body("email")
    .trim()
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
];
