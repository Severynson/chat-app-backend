"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
    },
}, { timestamps: true });
