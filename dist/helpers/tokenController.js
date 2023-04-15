"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenController = {
    generateToken: (user) => {
        return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
    },
    verifyToken: (token) => jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET),
};
exports.default = tokenController;
