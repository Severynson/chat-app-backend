"use strict";
exports.__esModule = true;
exports.messageSchema = void 0;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
exports.messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String
    }
}, { timestamps: true });
