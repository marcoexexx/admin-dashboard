import { StatusCode } from "../utils/appError";

import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { DeleteAuditLogSchema } from "../schemas/auditLog.schema";
import { AuditLogService } from "../services/auditLog";
import { checkUser } from "../services/checkUser";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";

const service = AuditLogService.new();

export async function getAuditLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, resource, action } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { user } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const [count, logs] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          user: {
            id: sessionUser.isSuperuser ? undefined : sessionUser.id,
          },

          id,
          resource,
          action,
        },
        include: { user },
        orderBy: {
          updatedAt: "desc",
        },
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(logs, count));
  } catch (err) {
    next(err);
  }
}

export async function deleteAuditLogsHandler(
  req: Request<DeleteAuditLogSchema["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { auditLogId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const auditLog = (await service.tryDelete({
      where: {
        user: {
          id: sessionUser.isSuperuser ? undefined : sessionUser.id,
        },

        id: auditLogId,
      },
    })).ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ auditLog }));
  } catch (err) {
    next(err);
  }
}
