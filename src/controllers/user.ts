import { NextFunction, Request, Response } from "express";
import { Error } from "../helpers/errorInitializer";
import errorInitializer from "../helpers/errorInitializer";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/is-auth";

export const allAvailableChatmates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {userId} = req;
    const availableChatmatesList = await User.find({_id: {$ne: userId}}).select( "name _id");

    if (!availableChatmatesList)
      throw errorInitializer(
        "Error happened in fetching users from the DB!",
        500
      );

    res.status(200).json(availableChatmatesList);
  } catch (error: Error | any) {
    next(errorInitializer(error));
  }
};
