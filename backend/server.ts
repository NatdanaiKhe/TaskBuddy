
import app from "./src/app";
import config from "./src/config";
import {
  checkAndCreateEmailVerifyTable,
  checkAndCreatePasswordResetTable,
  checkAndCreateUserTable,
  checkAndCreateTasksTable,
  Database,
} from "./src/config/db";
import logger from "./src/utils/logger";

const PORT = config.PORT || 8000;


Database.ping().then(res => {
  if (res.success) {
    logger.info("Database connected successfully at", res.timestamp);
    checkAndCreateUserTable();
    checkAndCreateEmailVerifyTable();
    checkAndCreatePasswordResetTable();
    checkAndCreateTasksTable();
  } else {
    logger.error("Database connection failed:", res.error);
    process.exit(1);
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
// process.on("unhandledRejection", err => {
//   logger.error("UNHANDLED REJECTION! Shutting down...");
//   logger.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// Handle uncaught exceptions
// process.on("uncaughtException", err => {
//   logger.error("UNCAUGHT EXCEPTION! Shutting down...");
//   logger.error(err.name, err.message);
//   process.exit(1);
// });
