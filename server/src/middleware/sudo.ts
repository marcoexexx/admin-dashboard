import { NextFunction, Request, Response } from "express";
import { checkUser } from "../services/checkUser";

import AppError, { StatusCode } from "../utils/appError";

export function sudo(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    // @ts-ignore  for mocha testing
    const user = checkUser(req.user).ok_or_throw();

    if (!user.isSuperuser) {
      return next(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`));
    }

    next();
  } catch (err) {
    next(err);
  }
}
