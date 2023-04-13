"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
let io;
const ioControllerObject = {
    init: (httpServer, options) => {
        io = new socket_io_1.default.Server(httpServer, options);
        return io;
    },
    getIO: () => {
        if (!io)
            throw new Error("Socket.io not initialized!");
        else
            return io;
    },
};
exports.default = ioControllerObject;
