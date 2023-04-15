import { NextFunction, Response, Request } from "express";
import User from "../models/user";
import { validationResult } from "express-validator/check";
import bcrypt from "bcryptjs";
import { Error } from "../app";
import errorInitializer from "../helpers/errorInitializer";
import tokenController from "../helpers/tokenController";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty())
      throw errorInitializer("Validation failed!", 422, errors.array());

    const userDoc = await User.findOne({ email: req.body.email });

    if (!userDoc) {
      throw errorInitializer(
        "User do not exist or error while connecting to the DB!",
        500
      );
    } else {
      const passwordIsCorrect = await bcrypt.compare(
        req.body.password,
        userDoc.password
      );

      if (!passwordIsCorrect) {
        throw errorInitializer("Password is incorrect!", 422);
      } else {
        const user = { userId: userDoc._id.toString() };
        const token = tokenController.generateToken(user);

        res.status(201).json({ token });
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

    const userDoc = new User({
      email,
      password: hashedPw,
      name,
    });
    const result = await userDoc.save();

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
