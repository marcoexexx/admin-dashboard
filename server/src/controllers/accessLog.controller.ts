import { NextFunction, Request, Response } from "express";
import { HttpListResponse, HttpResponse } from "../utils/helper";
import { AccessLogFilterPagination, DeleteAccessLogSchema } from "../schemas/accessLog.schema";
import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


export async function getAccessLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const { filter = {}, pagination, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as AccessLogFilterPagination["include"]
    const {
      browser,
      ip,
      platform,
      date,
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, logs] = await db.$transaction([
      db.accessLog.count(),
      db.accessLog.findMany({
        where: {
          userId: user.id,
          browser,
          ip,
          platform,
          date,
        },
        include,
        skip: offset,
        take: pageSize,
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
