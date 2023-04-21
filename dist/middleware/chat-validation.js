"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidation = void 0;
const express_validator_1 = require("express-validator");
exports.messageValidation = [
    (0, express_validator_1.body)("text")
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Message can not be so short"),
    (0, express_validator_1.body)("author")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Message has to have the author!"),
];
