import { NextFunction, Request, Response } from "express";
import { tryParseInt } from "../utils/result/std";

import AppError, { StatusCode } from "../utils/appError";
import redisClient from "../utils/connectRedis";

/* It allowed 60 requests per 1 minute */
const ALLOWED_REQUEST_COUNT = 60;
const ALLOWED_EXPIRY_TIME = 60; // in seconds -> 1 minute

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.ip) {
    return next(AppError.new(StatusCode.BadRequest, `Unable to determine client IP address.`));
  }

  const key = req.ip;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  try {
    const requestCount = await redisClient.get(key);

    let resetTime: number;
    let retryAfter: number;
    let ttl = await redisClient.ttl(key);

    if (!requestCount || ttl === -1) {
      await redisClient.setEx(key, ALLOWED_EXPIRY_TIME, "1");
      resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME;
    } else {
      if (
        tryParseInt(requestCount, 10).expect("Failed to parse integer `requestcount`")
          > ALLOWED_REQUEST_COUNT
      ) {
        resetTime = (await redisClient.ttl(key)) + currentTimestamp;
        retryAfter = resetTime - currentTimestamp;

        res.set({
          "Retry-After": retryAfter,
        });

        return next(new AppError(429, "Too many request: Rate limit exceeded. Try again later"));
      } else {
        await redisClient.incr(key);
        resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME;
      }
    }

    res.set({
      "X-Rate-Limit-Limit": ALLOWED_REQUEST_COUNT,
      "X-Rate-Limit-Remaining": requestCount !== null
        ? ALLOWED_REQUEST_COUNT
          - tryParseInt(requestCount, 10).expect("Failed to parse integer `requestCount`")
        : ALLOWED_REQUEST_COUNT - 0,
      "X-Rate-Limit-Reset": ttl,
    });

    next();
  } catch (err) {
    next(err);
  }
}
