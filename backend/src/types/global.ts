import { UserResponse } from "./userType";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
      file?: Express.Multer.File | undefined

    }
  }
}
