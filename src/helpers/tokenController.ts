import jwt from "jsonwebtoken";

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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "1h",
    });
  },
  verifyToken: (token) =>
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as ExtendedJwtType,
};

export default tokenController;
