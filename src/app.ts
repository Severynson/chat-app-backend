import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import SocketIO from "socket.io";
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import userRoutes from "./routes/user";
import ioControllerObject from "./socket";

export interface Error extends globalThis.Error {
  statusCode?: number;
  data?: Object[];
}

const app = express();

const MONGODB_URI =
  "mongodb+srv://user1:user1@nodejs-course-cluster.mkrye9p.mongodb.net/chat-app?retryWrites=true&w=majority";

app.use(bodyParser.json()); // application/json
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hi there!" + " " + JSON.stringify(process.env));
  next();
});
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/user", userRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log("Error res sended");
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    // new SocketIO.Server
    const io: SocketIO.Server = ioControllerObject.init(server, {
      cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
    });

    io.on("connection", (socket) => {
      console.log("Client connected!");
    });
  })
  .catch((error: Error): ErrorCallback => {
    console.error(error);
    throw error;
  });
