import { NextFunction, Request, Response } from "express";
import getConfig from "../../utils/getConfig";
import { LoggingConfig } from "./config";

export const currentLevel = getConfig("logLevel") || "info";

export type Color = typeof currentLevel;

type Logging = Record<typeof currentLevel, <T extends unknown>(message: T, ...optionalParams: any[]) => void>;

export const level: Color[] = ["error", "warn", "debug", "info", "log"];

const logging: Logging = {
  log: (message, ...opt) =>
    4 <= level.indexOf(currentLevel)
      ? console.log(LoggingConfig.display(message, level[4]), ...opt)
      : undefined,

  info: (message, ...opt) =>
    3 <= level.indexOf(currentLevel)
      ? console.info(LoggingConfig.display(message, level[3]), ...opt)
      : undefined,

  debug: (message, ...opt) =>
    2 <= level.indexOf(currentLevel)
      ? console.debug(LoggingConfig.display(message, level[2]), ...opt)
      : undefined,

  warn: (message, ...opt) =>
    1 <= level.indexOf(currentLevel)
      ? console.warn(LoggingConfig.display(message, level[1]), ...opt)
      : undefined,

  error: (message, ...opt) =>
    0 <= level.indexOf(currentLevel)
      ? console.error(LoggingConfig.display(message, level[0]), ...opt)
      : undefined,
};

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = new Date();
  const { method, url } = req;

  // Capture the response finish event
  res.on("finish", () => {
    const endTime = new Date();
    const durstion = endTime.getTime() - startTime.getTime();
    logging.info(`${method} ${res.statusCode} ${durstion}ms`);
  });

  // // Capture errors
  // res.on("error", (err) => {
  //   logging.error("Error occurred for ${method} ${url}:", err.message)
  // });

  // Capture the response close event
  res.on("close", () => {
    logging.info(`Response closed for ${method} ${url}`);
  });

  next();
}

export default logging;
