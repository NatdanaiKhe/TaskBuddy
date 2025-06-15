import winston from "winston";
import config from "../config";
// log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  defaultMeta: { service: "taskbuddy-api" },
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (config.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
