import { StatusCode } from "../utils/appError";

import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { DeleteAuditLogSchema } from "../schemas/auditLog.schema";
import { AuditService } from "../services/auditLog";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";


const service = AuditService.new()


export async function getAuditLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, resource, action } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { user } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const [count, logs] = (await service.find({
      filter: {
        id,
        resource,
        action,
      },
      pagination: {
        page,
        pageSize,
      },
      include: {
        user
      },
      orderBy
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(logs, count))
  } catch (err) {
    next(err)
  }
}

export async function deleteAuditLogsHandler(
  req: Request<DeleteAuditLogSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { auditLogId } = req.params

    const auditLog = (await service.delete(auditLogId)).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ auditLog }))
  } catch (err) {
    next(err)
  }
}
