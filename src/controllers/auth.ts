import { NextFunction, Response, Request } from "express";
import User from "../models/user";
import { validationResult } from "express-validator/check";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Error } from "../app";
import dotenv from "dotenv";
import errorInitializer from "../helpers/errorInitializer";
const { parsed: ENV_VARIABLES } = dotenv.config();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty())
      throw errorInitializer("Validation failed!", 422, errors.array());

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw errorInitializer(
        "User do not exist or error while connecting to the DB!",
        500
      );
    } else {
      const passwordIsCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordIsCorrect) {
        throw errorInitializer("Password is incorrect!", 422);
      } else {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          ENV_VARIABLES!.SECRET,
          { expiresIn: "1h" }
        );

        res.status(201).json({ token, userId: user._id.toString() });
      }
    }
  } catch (error: Error | any) {
    next(errorInitializer(error));
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
    if (!errors.isEmpty())
      throw errorInitializer(
        "Validation failed. " + errors.array()[0].msg,
        422,
        errors.array()
      );

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
