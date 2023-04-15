"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const user_1 = __importDefault(require("./routes/user"));
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const MONGODB_URI = "mongodb+srv://user1:user1@nodejs-course-cluster.mkrye9p.mongodb.net/chat-app?retryWrites=true&w=majority";
app.use(body_parser_1.default.json()); // application/json
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.get("/", (req, res, next) => {
    res.send("Hi there!" + " " + JSON.stringify(process.env));
    next();
});
app.use("/auth", auth_1.default);
app.use("/chat", chat_1.default);
app.use("/user", user_1.default);
app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    console.log("Error res sended");
    res.status(status).json({ message: message, data: data });
});
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    // new SocketIO.Server
    const io = socket_1.default.init(server, {
        cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
    });
    io.on("connection", (socket) => {
        console.log("Client connected!");
    });
})
    .catch((error) => {
    console.error(error);
    throw error;
});
