import { NextFunction, Request, Response } from "express";
import logging from "./logging/logging";
import AppError from "../utils/appError";
import { verifyJwt } from "../utils/auth/jwt";
import redisClient from "../utils/connectRedis";
import { db } from "../utils/db";

export async function deserializeUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.header("authorization");

    let accessToken = 
       authorizationHeader && authorizationHeader.startsWith("Bearer")
        ? authorizationHeader.split(" ")[1]
        : req.cookies.access_token as string;

    if (!accessToken) return next(new AppError(401, "You are not logged in"))

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey")  //  decoded.sub == user.id
    if (!decoded) return next(new AppError(401, "Invalid token or user doesn't exist"))

    const session = await redisClient.get(decoded.sub)
    if (!session) return next(new AppError(401, "Invalid token or session has expired"))

    const user = await db.user.findFirst({
      where: {
        id: JSON.parse(session).id
      }
    })

    // @ts-ignore  for mocha testing
    req.user = user

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
