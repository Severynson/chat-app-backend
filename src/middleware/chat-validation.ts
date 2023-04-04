import { body } from "express-validator/check";

export const messageValidation = [
  body("text")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message can not be so short"),
  body("author")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Message has to have the author!"),
];
