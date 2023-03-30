import express from "express";
import mongoose from "mongoose";
import SocketIO from "socket.io";
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import ioControllerObject from "./socket";

const app = express();

const MONGODB_URI =
  "mongodb+srv://user1:user1@nodejs-course-cluster.mkrye9p.mongodb.net/chat-app?retryWrites=true&w=majority";

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome!" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(8080);
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
