import { NextFunction } from "express";
import logging from "../middleware/logging/logging";

export default class AppError extends Error {
  status: number;
  isOperational: boolean;

  constructor(statusCode: number = 500, message: string) {
    super(message)
    this.status = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (statusCode: number, next: NextFunction) => (err: any) => {
  const msg = err?.message || "unknown error";
  logging.error(msg)

  next(new AppError(statusCode, msg))
}

