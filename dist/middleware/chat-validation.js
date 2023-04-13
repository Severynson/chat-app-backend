"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidation = void 0;
const check_1 = require("express-validator/check");
exports.messageValidation = [
    (0, check_1.body)("text")
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Message can not be so short"),
    (0, check_1.body)("author")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Message has to have the author!"),
];
