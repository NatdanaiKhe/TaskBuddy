import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const PASSWORD_RESET_TOKEN_SECRET = process.env.PASSWORD_RESET_TOKEN_SECRET!;
const JWT_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRE || "30d";

interface TokenPayload extends jwt.JwtPayload {
  id: string;
  role: string;
}

const generateAccessToken = (userId: string, userRole: string): string => {
  const token = jwt.sign({ id: userId, role: userRole }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const generateRefreshToken = (userId: string, userRole: string): string => {
  const token = jwt.sign({ id: userId, role: userRole }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const verifyAccessToken = (token: string): { id: string; role: string } => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      return decoded as TokenPayload;
    }
    throw new Error("Invalid token");
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const verifyRefreshToken = (token: string): { id: string; role: string } => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      return decoded as TokenPayload;
    }

    throw new Error("Invalid token");
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
