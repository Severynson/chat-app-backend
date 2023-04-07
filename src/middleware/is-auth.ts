import { NextFunction, Response, Request } from "express";
import errorInitializer from "../helpers/errorInitializer";
import tokenController from "../helpers/tokenController";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw errorInitializer("Not authenticated!", 401);

    const token: string = authHeader.split(" ")[1];

    const decodedToken = tokenController.verifyToken(token);

    if (!decodedToken) throw errorInitializer("Not authenticated!", 401);

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(errorInitializer(error));
  }
};
