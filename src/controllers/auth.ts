import { NextFunction, Response, Request } from "express";
import User from "../models/user";
import { validationResult } from "express-validator/check";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Error } from "../app";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error: Error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const error: Error = new Error(
        "User do not exist or error while connecting to the DB!"
      );
      error.statusCode = 500;
      throw error;
    } else {
      const passwordIsCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordIsCorrect) {
        const error: Error = new Error("Password is incorrect!");
        error.statusCode = 401;
        throw error;
      } else {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          "somesecret1",
          { expiresIn: "1h" }
        );

        res.status(201).json({ token, userId: user._id.toString() });
      }
    }
  } catch (error: Error | any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, name, password } = req.body;
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const error: Error = new Error(
          "Validation failed. " + errors.array()[0].msg
        );
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
  
      const hashedPw: string = await bcrypt.hash(password, 12);
  
      const user = new User({
        email,
        password: hashedPw,
        name,
      });
      const result = await user.save();
  
      if (!result) {
        const error: Error = new Error("Error while creating a user!");
        error.statusCode = 500;
        throw error;
      }
  
      res.status(201).json({ message: "User created!", userId: result._id });
    } catch (err: Error | any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };