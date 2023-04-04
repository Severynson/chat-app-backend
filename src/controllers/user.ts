import { NextFunction, Request, Response } from "express";
import { Error } from "../helpers/errorInitializer";
import errorInitializer from "../helpers/errorInitializer";
import User from "../models/user";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("name _id");

    if (!users)
      throw errorInitializer(
        "Error happened in fetching users from the DB!",
        500
      );

    res.status(200).json(users);
  } catch (error: Error | any) {
    next(errorInitializer(error));
  }
};
