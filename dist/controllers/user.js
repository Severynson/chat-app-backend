"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAvailableChatmates = void 0;
const errorInitializer_1 = __importDefault(require("../helpers/errorInitializer"));
const user_1 = __importDefault(require("../models/user"));
const allAvailableChatmates = async (req, res, next) => {
    try {
        const { userId } = req;
        const availableChatmatesList = await user_1.default.find({ _id: { $ne: userId } }).select("name _id");
        if (!availableChatmatesList)
            throw (0, errorInitializer_1.default)("Error happened in fetching users from the DB!", 500);
        res.status(200).json(availableChatmatesList);
    }
    catch (error) {
        next((0, errorInitializer_1.default)(error));
    }
};
exports.allAvailableChatmates = allAvailableChatmates;
