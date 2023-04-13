"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChat = void 0;
const errorInitializer_1 = __importDefault(require("../helpers/errorInitializer"));
const chat_1 = __importDefault(require("../models/chat"));
const user_1 = __importDefault(require("../models/user"));
const socket_1 = __importDefault(require("../socket"));
const getChat = async (req, res, next) => {
    // SHOUL BE A GET REQUEST WITH DINAMIC ROUTES AND USER ID SHOLD BE like chat-userid|interlocutor;
    console.log("getc");
    const { userId } = req;
    const { chatmateId } = req.params;
    console.log(userId, chatmateId);
    try {
        const chat = await chat_1.default.findOne({
            $or: [
                { title: `${chatmateId} & ${userId}` },
                { title: `${userId} & ${chatmateId}` },
            ],
        }).populate({ path: "messages.author", select: "name" });
        if (!chat) {
            const chat = await chat_1.default.create({
                title: `${chatmateId} & ${userId}`,
                messages: [],
            });
            (await chat.save()) && res.status(201).json({ chat, userId });
        }
        else {
            res.status(201).json({ chat, userId });
        }
    }
    catch (error) {
        next((0, errorInitializer_1.default)(error));
    }
};
exports.getChat = getChat;
const sendMessage = async (req, res, next) => {
    const { userId: myId } = req;
    const { interlocutorId, message } = req.body;
    console.log(myId, interlocutorId);
    const filterForChatTitle = {
        $or: [
            { title: `${interlocutorId} & ${myId}` },
            { title: `${myId} & ${interlocutorId}` },
        ],
    };
    try {
        console.log(`${interlocutorId} & ${myId}`);
        const chat = await chat_1.default.findOneAndUpdate(filterForChatTitle, {
            $push: { messages: message },
        });
        const lastMessage = (await chat_1.default.findOne(filterForChatTitle))?.messages.at(-1);
        (await chat?.save()) &&
            socket_1.default.getIO().emit("messages", {
                action: "send",
                message: {
                    ...lastMessage?.toObject(),
                    author: await user_1.default.findById(message.author),
                },
            });
        res.status(201).json({ chat, myId });
    }
    catch (error) {
        next((0, errorInitializer_1.default)(error));
    }
};
exports.sendMessage = sendMessage;
