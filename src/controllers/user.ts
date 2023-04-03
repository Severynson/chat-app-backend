import { NextFunction, Request, Response } from "express";
import { Error } from "../app";
import User from "../models/user";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("name _id");
    if (!users) {
      const error: Error = new Error(
        "Error happened in fetching users from the DB!"
      );
      error.statusCode = 500;
      throw error;
    }
    res.status(201).json(users);
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
