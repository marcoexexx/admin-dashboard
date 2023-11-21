import { NextFunction, Request, Response } from "express";
import logging from "./logging/logging";
import AppError from "../utils/appError";

export function onlyAdminUser(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    if (user.role !== "Admin") return next(new AppError(403, "You do not have permission to access this resource."))

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

