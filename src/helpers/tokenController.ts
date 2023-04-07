import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const { parsed: ENV_VARIABLES } = dotenv.config();

interface User {
  userId: string;
}

interface ExtendedJwtType extends jwt.JwtPayload {
  userId?: string;
}

interface TokenController {
  generateToken: (user: User) => string;
  verifyToken: (token: string) => ExtendedJwtType;
}

const tokenController: TokenController = {
  generateToken: (user: User) => {
    return jwt.sign(user, ENV_VARIABLES!.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
  },
  verifyToken: (token) =>
    jwt.verify(token, ENV_VARIABLES!.ACCESS_TOKEN_SECRET) as ExtendedJwtType,
};

export default tokenController;
