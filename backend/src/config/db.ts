import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log("Database configuration:", {
  user: dbConfig.user,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

class Database {
  private static pool = createPool(dbConfig);

  static async query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, params, (error, results) => {
        if (error) {
          console.error("Database query error:", error);
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static async ping(): Promise<{ success: boolean; timestamp?: string; error?: string }> {
    try {
      await this.query("SELECT 1");
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Database ping error:", error);
      return { success: false, error: String(error) };
    }
  }
}

export { Database, dbConfig };