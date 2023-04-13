"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const message_1 = require("./message");
const Schema = mongoose_1.default.Schema;
const chatSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    messages: { type: [message_1.messageSchema], required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Chat", chatSchema);
