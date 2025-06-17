import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth.service";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!roles.includes(req.user?.role)) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    next();
  };
};

export { authenticate, authorizeRoles, AuthenticatedRequest };
