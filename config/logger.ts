import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

winston.addColors(colors);

const cloudwatchTransport = new WinstonCloudWatch({
  logGroupName: "MyAppLogs",
  logStreamName: "MyAppStream",
  awsRegion: process.env.AWS_REGION || "ap-south-1",
  jsonMessage: true, // Logs will be structured in JSON format
});

const loggerInstance = winston.createLogger({
  level: "debug", // Default to "debug" so it can filter based on user input
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console(), cloudwatchTransport],
});

/**
 * Custom function to log based on user-defined settings.
 * @param {Object} options - Logging preferences.
 * @param {boolean} options.info - Enable info logs.
 * @param {boolean} options.error - Enable error logs.
 * @param {boolean} options.warn - Enable warning logs.
 * @param {boolean} options.debug - Enable debug logs.
 */
const logMessage = (options: {
  info?: boolean;
  error?: boolean;
  warn?: boolean;
  debug?: boolean;
}) => {
  return {
    info: (msg: string) => options.info && loggerInstance.info(msg),
    error: (msg: string) => options.error && loggerInstance.error(msg),
    warn: (msg: string) => options.warn && loggerInstance.warn(msg),
    debug: (msg: string) => options.debug && loggerInstance.debug(msg),
  };
};

const isAllEnabled = process.env.LOGGER_LEVEL === "*";

const logger = logMessage({
  info: isAllEnabled || process.env.LOGGER_LEVEL === "info",
  error: isAllEnabled || process.env.LOGGER_LEVEL === "error",
  warn: isAllEnabled || process.env.LOGGER_LEVEL === "warn",
  debug: isAllEnabled || process.env.LOGGER_LEVEL === "debug",
});

export { logger };
