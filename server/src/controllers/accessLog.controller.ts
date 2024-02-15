import { StatusCode } from "../utils/appError";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { DeleteAccessLogSchema } from "../schemas/accessLog.schema";
import { AccessLogService } from "../services/accessLog";
import { OperationAction, Resource } from "@prisma/client";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { checkUser } from "../services/checkUser";


const resource = Resource.AccessLog
const service = AccessLogService.new()


export async function getAccessLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha
    checkUser(req.user).ok_or_throw()

    const query = convertNumericStrings(req.query)

    const { id, browser, ip, platform, date } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { user } = convertStringToBoolean(query.include) ?? {}

    const [count, logs] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize }
      },
      {
        where: {
          user: {
            OR: [
              { isSuperuser: true },
              {
                role: {
                  permissions: {
                    some: {
                      action: OperationAction.Read,
                      resource
                    }
                  }
                }
              }
            ]
          },

          id,
          browser,
          ip,
          platform,
          date
        },
        include: {
          user
        }
      }
    )).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(logs, count))
  } catch (err) {
    next(err)
  }
}

export async function deleteAccessLogsHandler(
  req: Request<DeleteAccessLogSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { accessLogId } = req.params

    const accessLog = (await service.tryDelete({
      where: {
        user: {
          OR: [
            { isSuperuser: true },
            {
              role: {
                permissions: {
                  some: {
                    action: OperationAction.Delete,
                    resource
                  }
                }
              }
            }
          ]
        },
        id: accessLogId
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ accessLog }))
  } catch (err) {
    next(err)
  }
}
