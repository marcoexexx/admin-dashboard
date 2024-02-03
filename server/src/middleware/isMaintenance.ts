import { NextFunction, Request, Response } from "express";

import redisClient from "../utils/connectRedis";
import AppError, { StatusCode } from "../utils/appError";


const KEY = "maintenance"

export async function isMaintenance(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const maintenance = await redisClient.get("maintenance")

    if (maintenance !== null) {
      const remaining_time = await redisClient.ttl(KEY)
      if (remaining_time > 0) return next(AppError.new(StatusCode.ServiceUnavailable, `The API is currently under maintenance. Expected to be back online in (${remaining_time}sec.)`))
    }

    next()
  } catch (err: any) {
    next(err)
  }
}
