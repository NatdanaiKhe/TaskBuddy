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

  static async ping(): Promise<{
    success: boolean;
    timestamp?: string;
    error?: string;
  }> {
    try {
      await this.query("SELECT 1");
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Database ping error:", error);
      return { success: false, error: String(error) };
    }
  }
}
async function checkTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY, 
  email VARCHAR(255) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'provider') NOT NULL DEFAULT 'customer',
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  refreshToken VARCHAR(255) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

  `;

  try {
    await Database.query(createTableQuery);
    console.log("Table `users` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}

export { Database, dbConfig, checkTableExists };
