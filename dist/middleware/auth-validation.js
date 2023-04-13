"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = exports.loginValidation = void 0;
const check_1 = require("express-validator/check");
const user_1 = __importDefault(require("../models/user"));
exports.loginValidation = [
    (0, check_1.body)("email").trim().isEmail().withMessage("Please enter a valid email."),
    (0, check_1.body)("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password is too short!"),
];
exports.signupValidation = [
    (0, check_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
        return user_1.default.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject("E-Mail address already exists!");
            }
        });
    }),
    (0, check_1.body)("password")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Password is too short!"),
    (0, check_1.body)("name").trim().not().isEmpty().withMessage("Username can't be empty!"),
];
