import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { Error } from "../app";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}
interface ExtendedJwtType extends jwt.JwtPayload {
  userId?: string;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: Error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  const token: string = authHeader.split(" ")[1];
  let decodedToken: ExtendedJwtType;

  try {
    decodedToken = jwt.verify(token, "somesecret1", {
      ignoreExpiration: true,
    }) as ExtendedJwtType;
  } catch (error: Error | any) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error: Error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
