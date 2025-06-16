import { UserResponse } from "./userType";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}
