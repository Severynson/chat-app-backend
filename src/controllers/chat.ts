import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/is-auth";
import Chat from "../models/chat";
import User from "../models/user";
import ioControllerObject from "../socket";

export const getChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId: myId } = req;
  const { interlocutorId } = req.body;

  console.log("interlocutorId => ", interlocutorId, ", myId => ", myId);
  try {
    const chat = await Chat.findOne({
      $or: [
        { title: `${interlocutorId} & ${myId}` },
        { title: `${myId} & ${interlocutorId}` },
      ],
    }).populate({ path: "messages.author", select: "name" });
    if (!chat) {
      const chat = await Chat.create({
        title: `${interlocutorId} & ${myId}`,
        messages: [],
      });

      (await chat.save()) && res.status(201).json(chat);
    } else {
      res.status(201).json(chat);
    }
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// export const sendMessage = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { userId: myId } = req;
//   const { interlocutorId, message } = req.body;
//   try {
//     console.log(`${interlocutorId} & ${myId}`);
//     const chat = await Chat.findOneAndUpdate(
//       {
//         $or: [
//           { title: `${interlocutorId} & ${myId}` },
//           { title: `${myId} & ${interlocutorId}` },
//         ],
//       },
//       {
//         $push: {
//           messages: message,
//         },
//       }
//     );

//     message.author = {
//       _id: message.author,
//     };

//     const lastMessage = (await Chat.findOne({
//         $or: [
//           { title: `${interlocutorId} & ${myId}` },
//           { title: `${myId} & ${interlocutorId}` },
//         ],
//       }))?.messages.at(-1);

//     // console.log(chat?.messages[-1])

//     (await chat?.save()) &&
//       ioControllerObject.getIO().emit("messages", {
//         action: "send",
//         message: {
//           ...message,
//           author: await User.findById(message.author),
//           createdAt: new Date().toISOString(),
//         },
//       });

//     res.status(201).json(chat);
//   } catch (error: Error | any) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId: myId } = req;
  const { interlocutorId, message } = req.body;

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

    res.status(201).json(chat);
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
