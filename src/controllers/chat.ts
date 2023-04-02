import { NextFunction, Request, Response } from "express";
import Chat from "../models/chat";

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.findOne({
      $or: [
        { title: `${req.body.interlocutorId} & ${req.body.userId}` },
        { title: `${req.body.userId} & ${req.body.interlocutorId}` },
      ],
    }).populate({ path: "messages.author", select: "name" });
    if (!chat) {
      const chat = Chat.create({
        title: `${req.body.interlocutorId} & ${req.body.userId}`,
        messages: [],
      });

      res.status(201).json(chat);
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

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(`${req.body.interlocutorId} & ${req.body.userId}`);
    const chat = await Chat.findOneAndUpdate(
      {
        $or: [
          { title: `${req.body.interlocutorId} & ${req.body.userId}` },
          { title: `${req.body.userId} & ${req.body.interlocutorId}` },
        ],
      },
      {
        $push: {
          messages: req.body.message,
        },
      }
    );

    console.log(req.body.message);

    console.log("Chat  ===>  ", chat);

    res.status(201).json(chat);
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};