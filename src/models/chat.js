"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var message_1 = require("./message");
var Schema = mongoose_1["default"].Schema;
var chatSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    messages: { type: [message_1.messageSchema], required: true }
}, { timestamps: true });
exports["default"] = mongoose_1["default"].model("Chat", chatSchema);
