import jwt from "jsonwebtoken";

const generateToken = (userId: string, userRole: string): string => {
  const token = jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { generateToken, verifyToken };
