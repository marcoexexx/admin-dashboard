import { NextFunction, Request, Response } from "express";
import { checkUser } from "../services/checkUser";
import { db } from "../utils/db";

import AppError, { StatusCode } from "../utils/appError";

export async function checkBlockedUser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const sessionUser = checkUser(req?.user).ok();

    if (!sessionUser) return next();

    const isBlocked = await db.user.findFirst({
      where: {
        blockedUsers: {
          some: {
            userId: sessionUser.id,
          },
        },
      },
    });

    if (isBlocked !== null) {
      return next(
        AppError.new(StatusCode.Forbidden, `You are blocked and cannot access this resource.`),
      );
    }

    next();
  } catch (err: any) {
    next(err);
  }
}
