import { NextFunction, Response } from "express";
import errorInitializer from "../helpers/errorInitializer";
import { AuthenticatedRequest } from "../middleware/is-auth";
import Chat from "../models/chat";
import User from "../models/user";
import ioControllerObject from "../socket";

export const getChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // SHOUL BE A GET REQUEST WITH DINAMIC ROUTES AND USER ID SHOLD BE like chat-userid|interlocutor;
  console.log("getc");
  const { userId } = req;
  const { chatmateId } = req.params;

  console.log(userId, chatmateId);

  try {
    const chat = await Chat.findOne({
      $or: [
        { title: `${chatmateId} & ${userId}` },
        { title: `${userId} & ${chatmateId}` },
      ],
    }).populate({ path: "messages.author", select: "name" });

    if (!chat) {
      const chat = await Chat.create({
        title: `${chatmateId} & ${userId}`,
        messages: [],
      });

      (await chat.save()) && res.status(201).json({ chat, userId });
    } else {
      res.status(201).json({ chat, userId });
    }
  } catch (error: Error | any) {
    next(errorInitializer(error));
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
    const chat = await Chat.findOneAndUpdate(filterForChatTitle, {
      $push: { messages: message },
    });

    const lastMessage = (await Chat.findOne(filterForChatTitle))?.messages.at(
      -1
    );

    (await chat?.save()) &&
      ioControllerObject.getIO().emit("messages", {
        action: "send",
        message: {
          ...lastMessage?.toObject(),
          author: await User.findById(message.author),
        },
      });

    res.status(201).json({ chat, myId });
  } catch (error: Error | any) {
    next(errorInitializer(error));
  }
};
