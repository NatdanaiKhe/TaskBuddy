import { Database } from "../config/db";
import { CreateUserDto, UserResponse, User } from "../types";
import logger from "../utils/logger";

export class UserModel {
  static async createUser(userData: CreateUserDto): Promise<any> {
    const {
      id,
      email,
      firstName,
      lastName,
      role,
      isActive = 1,
      password,
    } = userData;

    // Check if user already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      logger.error(`User with email ${email} already exists.`);
      throw new Error("User already exists");
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
    ];

    const result = await Database.query(query, values);

    if (result.affectedRows === 0) {
      logger.error("Failed to create user.");
      throw new Error("Failed to create user");
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
    const query = "SELECT * FROM users WHERE id = ?";
    const result = await Database.query(query, [userId]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await Database.query(query, [email]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
