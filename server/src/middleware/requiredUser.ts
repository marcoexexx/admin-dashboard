import { NextFunction, Request, Response } from "express";
import { checkUser } from "../services/checkUser";

import AppError from "../utils/appError";
import logging from "./logging/logging";


export function requiredUser(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    checkUser(req.user).ok_or_throw()

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
