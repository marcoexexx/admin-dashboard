import { NextFunction, Request, Response } from "express";

import logging from "./logging/logging";
import AppError, { StatusCode } from "../utils/appError";
import redisClient from "../utils/connectRedis";


export async function isMaintenance(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const maintenance = await redisClient.get("maintenance")

    if (maintenance !== null) {
      const remaining_time = await redisClient.ttl("maintenance")
      if (remaining_time > 0) return next(AppError.new(StatusCode.ServiceUnavailable, `The API is currently under maintenance. Expected to be back online in (${remaining_time}sec.)`))
    }

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


