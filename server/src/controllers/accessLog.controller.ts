import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpListResponse, HttpResponse } from "../utils/helper";
import { DeleteAccessLogSchema } from "../schemas/accessLog.schema";

export async function getAccessLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const [count, logs] = await db.$transaction([
      db.accessLog.count(),
      db.accessLog.findMany({
        where: {
          userId: user.id
        },
        include: {
          user: true
        }
      })
    ])

    res.status(200).json(HttpListResponse(logs, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

export async function deleteAccessLogsHandler(
  req: Request<DeleteAccessLogSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { accessLogId } = req.params

    await db.accessLog.delete({
      where: {
        id: accessLogId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
