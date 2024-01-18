import { NextFunction, Request, Response } from "express";
import { HttpListResponse, HttpResponse } from "../utils/helper";
import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";
import { AuditLogFilterPagination, DeleteAuditLogSchema } from "../schemas/auditLog.schema";


export async function getAuditLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha
    const user = req.user

    const { filter = {}, pagination, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as AuditLogFilterPagination["include"]
    const {
      resource,
      action
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, logs] = await db.$transaction([
      db.eventAction.count(),
      db.eventAction.findMany({
        where: {
          userId: user?.id,
          action,
          resource,
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

export async function deleteAuditLogsHandler(
  req: Request<DeleteAuditLogSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { auditLogId } = req.params

    await db.eventAction.delete({
      where: {
        id: auditLogId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

