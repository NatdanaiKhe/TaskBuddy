import { query } from "winston";
import { Database } from "../config/db";

export class PasswordResetModel {
  static async getByEmail(email: string): Promise<{
    user_id: number;
    token: string;
    expires_at: Date;
    used: boolean;
    email: string;
  } | null> {
    const tokenByEmailQuery = `
  SELECT 
    password_reset_tokens.user_id,
    password_reset_tokens.token,
    password_reset_tokens.expires_at,
    password_reset_tokens.used,
    users.email
  FROM password_reset_tokens
  INNER JOIN users ON password_reset_tokens.user_id = users.id
  WHERE users.email = ? AND password_reset_tokens.used = false AND password_reset_tokens.expires_at > NOW()
  ORDER BY password_reset_tokens.created_at DESC
  LIMIT 1
`;

    const value = [email];

    const result = await Database.query(tokenByEmailQuery, value);

    if (result.length == 0) {
      return null;
    }

    return result[0];
  }
  static async create(
    user_id: string,
    token: string,
    expired_at: Date
  ): Promise<{ user_id: string; token: string; expires_at: Date } | null> {
    const query =
      "INSERT INTO password_reset_tokens (user_id,token,expires_at) VALUES (?,?,?)";
    const values = [user_id, token, expired_at];

    const result = await Database.query(query, values);
    if (result.affectedRows === 0) {
      return null;
    }

    return {
      user_id,
      token,
      expires_at: expired_at,
    };
  }

  static async update(token: string, password: string): Promise<any> {
    // get user id from token
    const query =
      "SELECT id,user_id from password_reset_tokens WHERE token = ? AND expires_at > NOW() AND used != true";
    const values = [token];
    const result = await Database.query(query, values);
    
    if (result.length == 0) {
      return null;
    }

    const queryUpdatePassword = "UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?";
    const valueUpdatePassword = [password, result[0].user_id];
    const updatePasswordResult = await Database.query(
      queryUpdatePassword,
      valueUpdatePassword
    );

    if (updatePasswordResult.affectedRows == 0) {
      return null;
    }

    const querySetUsedToken =
      "UPDATE password_reset_tokens SET used = true WHERE id = ?";
    const setUsedToken = await Database.query(querySetUsedToken, [
      result[0].id,
    ]);

    if (setUsedToken.affectedRows == 0) {
      return null;
    }

    return updatePasswordResult;
  }
}
