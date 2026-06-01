import { query } from "winston";
import { Database } from "../config/db";

export class TokenModel {
  static async findRefreshToken(userId: string): Promise<string | null> {
    const query = "SELECT refreshToken FROM users WHERE id = ?";

    const result = await Database.query(query, [userId]);
    if (result.length == 0) {
      return null;
    }

    return result[0];
  }

  static async saveRefreshToken(
    userId: string,
    token: string
  ): Promise<boolean> {
    const query = "UPDATE users SET refreshToken = ? WHERE id = ?";

    const result = await Database.query(query, [token, userId]);
    return result.affectedRows > 0;
  }

  static async deleteRefreshToken(token: string): Promise<boolean> {
    const query = "UPDATE users SET refreshToken = null WHERE refreshToken = ?";

    const result = await Database.query(query, [token]);
    return result.affectedRows > 0;
  }
}
