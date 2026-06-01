import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

console.log("Database configuration:", {
  connectionString: process.env.DATABASE_URL ? "set" : "not set",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || "5432",
  database: process.env.DB_NAME,
});

class Database {
  private static pool = new Pool(dbConfig);

  static async query(query: string, params: any[] = []): Promise<any> {
    try {
      let paramIndex = 0;
      const transformedQuery = query.replace(/\?/g, () => `$${++paramIndex}`);
      const result: QueryResult = await this.pool.query(transformedQuery, params);
      const rows = result.rows as any;
      rows.affectedRows = result.rowCount ?? 0;
      rows.insertId = result.rows?.[0]?.id ?? null;
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
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

const resolveTargetDatabaseName = (): string | null => {
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      const dbName = parsed.pathname.replace(/^\//, "");
      return dbName || null;
    } catch (error) {
      console.error("Invalid DATABASE_URL:", error);
      return null;
    }
  }

  return process.env.DB_NAME || null;
};

const buildAdminConfig = () => {
  if (process.env.DATABASE_URL) {
    const parsed = new URL(process.env.DATABASE_URL);
    parsed.pathname = "/postgres";
    return { connectionString: parsed.toString() };
  }

  return {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
  };
};

async function ensureDatabaseExists(): Promise<void> {
  const dbName = resolveTargetDatabaseName();
  if (!dbName) {
    console.warn("No database name configured; skipping auto-create step.");
    return;
  }

  const adminPool = new Pool(buildAdminConfig());
  try {
    const checkResult = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkResult.rowCount && checkResult.rowCount > 0) {
      return;
    }

    const escapedDbName = dbName.replace(/"/g, "\"\"");
    await adminPool.query(`CREATE DATABASE "${escapedDbName}"`);
    console.log(`Database "${dbName}" created`);
  } finally {
    await adminPool.end();
  }
}
async function checkAndCreateUserTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL UNIQUE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider')),
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  refreshToken VARCHAR(255) DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

  try {
    await Database.query(createTableQuery);
    console.log("Table `users` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}

async function checkAndCreateEmailVerifyTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token CHAR(36) NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`;
  try {
    await Database.query(createTableQuery);
    console.log("Table `email_verification_tokens` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}

async function checkAndCreatePasswordResetTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
  try {
    await Database.query(createTableQuery);
    console.log("Table `password_reset_tokens` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}
async function checkAndCreateTasksTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY,
  provider_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  location VARCHAR(255),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (provider_id) REFERENCES users(id)
);

`;
  try {
    await Database.query(createTableQuery);
    console.log("Table `tasks` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}

async function checkAndCreateBookingTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    task_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INT NOT NULL,
    total_price INT NOT NULL,
    notes TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'declined','cancelled', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  );`;
  try {
    await Database.query(createTableQuery);
    console.log("Table `bookings` is ready");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating table:", err.message);
    }
  }
}

export {
  Database,
  dbConfig,
  ensureDatabaseExists,
  checkAndCreateUserTable,
  checkAndCreateEmailVerifyTable,
  checkAndCreatePasswordResetTable,
  checkAndCreateTasksTable,
  checkAndCreateBookingTable,
};
