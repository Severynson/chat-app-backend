import { NextFunction, Request, Response } from "express";
import User from "../models/user";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("name _id");
    res.status(201).json(users);
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
