import { query } from "winston";
import { Database } from "../config/db";
import logger from "../utils/logger";

export class EmailVerifyModel {
  static async create(user_id: string, token: string): Promise<any> {
    const query =
      "INSERT INTO email_verification_tokens (user_id,token) VALUES (?,?)";
    const values = [user_id, token];

    const result = await Database.query(query, values);
    if (!result[0]) {
      return null;
    }

    return result[0];
  }

  static async update(token: string): Promise<any> {
    // get user id from token
    const query =
      "SELECT user_id from email_verification_tokens WHERE token = ?";
    const values = [token];
    const result = await Database.query(query, values);
    
    if (!result) {
      return null;
    }

    // update user status
    const queryUpdate =
      "UPDATE users SET isActive = true, updatedAt = ? WHERE id = ?";
    const valueUpdate = [new Date(),result[0].user_id];
    const updateResult = await Database.query(queryUpdate, valueUpdate);

    if (updateResult.affectedRow == 0) {
      return null;
    }
    return updateResult;
  }
}
