import { Database } from "../config/db";
import { CreateUserDto, UserResponse, User, UpdateUserDto } from "../types/userType";
import logger from "../utils/logger";

export class UserModel {
  static async createUser(userData: CreateUserDto): Promise<any> {
    const {
      id,
      email,
      firstName,
      lastName,
      role,
      isActive = 0,
      password,
    } = userData;

    // Check if user already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      return null;
    }

    const query = `
      INSERT INTO users (id, email, firstName, lastName, role, isActive, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      id,
      email,
      firstName,
      lastName,
      role || "customer",
      isActive ? 1 : 0,
      password,
    ];

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      logger.error("Failed to create user", { email });
      return null;
    }

    return {
      id,
      email,
      firstName,
      lastName,
      role: role || "customer",
      isActive: isActive ? 1 : 0,
      password,
      message: "User created successfully",
      success: true,
    };
  }

  static async getUserById(userId: string) {
    const query = "SELECT id,email,firstName,lastName,role FROM users WHERE id = ?";
    const result = await Database.query(query, [userId]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  static async getUserByEmail(email: string): Promise<User | null> {

    const query =
      "SELECT id,email,firstName,lastName,role,password FROM users WHERE email = ? AND isActive = 1";
    const result = await Database.query(query, [email]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  static async getAllUsers(
    limit: number = 10,
    page: number = 1
  ): Promise<UserResponse[]> {
    const query =
      "SELECT * FROM users  ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const offset = (page - 1) * limit;
    const values = [limit, offset];
    const result = await Database.query(query, values);

    if (result.length === 0) {
      return [];
    }

    return result.map((user: User) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  static async updateUser(
    userId: string,
    userData: Partial<UpdateUserDto>
  ): Promise<UpdateUserDto | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.firstName !== undefined) {
      fields.push("firstName = ?");
      values.push(userData.firstName);
    }

    if (userData.lastName !== undefined) {
      fields.push("lastName = ?");
      values.push(userData.lastName);
    }

    if (userData.isActive !== undefined) {
      fields.push("isActive = ?");
      values.push(userData.isActive ? 1 : 0);
    }
    if (fields.length === 0) {
      return null;
    }

    const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
    values.push(userId);

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      ...userData,
      updatedAt: new Date(),
    };
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = ?";
    const result = await Database.query(query, [userId]);

    return result.affectedRows > 0;
  }
}
