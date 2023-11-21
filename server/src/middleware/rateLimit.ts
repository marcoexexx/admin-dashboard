import { NextFunction, Request, Response } from "express";
import logging from "./logging/logging";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { parseInt } from "lodash";


/* It allowed 60 requests per 1 minute */
const ALLOWED_REQUEST_COUNT = 60
const ALLOWED_EXPIRY_TIME = 60  // in seconds -> 1 minute


export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.ip) return next(new AppError(400, "Unable to determine client IP address."))

  const key = req.ip
  const currentTimestamp = Math.floor(Date.now() / 1000)

  try {
    const requestCount = await redisClient.get(key)

    let resetTime: number
    let retryAfter: number
    let ttl = await redisClient.ttl(key)

    if (!requestCount) {
      await redisClient.setEx(key, ALLOWED_EXPIRY_TIME, "1")
      resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME
    } else {
      if (parseInt(requestCount, 10) > ALLOWED_REQUEST_COUNT) {
        resetTime = (await redisClient.ttl(key)) + currentTimestamp
        retryAfter = resetTime - currentTimestamp

        res.set({
          "Retry-After": retryAfter
        })

        return next(new AppError(429, "Too many request: Rate limit exceeded. Try again later"))
      } else {
        await redisClient.incr(key)
        resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME
      }
    }

    res.set({
      "X-Rate-Limit-Limit": ALLOWED_REQUEST_COUNT,
      "X-Rate-Limit-Remaining": requestCount !== null ? ALLOWED_REQUEST_COUNT - parseInt(requestCount, 10) : ALLOWED_REQUEST_COUNT - 0,
      "X-Rate-Limit-Reset": ttl
    })

    next()
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
