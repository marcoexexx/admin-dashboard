import Result, { Err, Ok } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AccessLog, Prisma } from "@prisma/client";
import { AppService, Pagination } from "../type";
import { db } from "../../utils/db";


/**
 * AccessLogService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 *
 * @example
 * ```typescript
 * const accessLogService = AccessLogService.new()
 * const [count, logs] = (await accessLogService.find({
 *   filter: { ... },
 *   pagination: { page: 1, pageSize: 10 },
 *   include: { ... }
 * })).ok_or_throw()
 *
 * ```
 */
export class AccessLogService implements AppService {
  /**
   * Creates a new instance of AccessLogService.
   * @returns A new instance of AccessLogService.
   */
  static new() { return new AccessLogService() }


  // Find implements
  async find(arg: { filter?: Prisma.AccessLogWhereInput; pagination: Pagination; include?: Prisma.AccessLogInclude }): Promise<Result<[number, AccessLog[]], AppError>> {
    const { filter, include, pagination } = arg
    const { page = 1, pageSize = 10 } = pagination
    const offset = (page - 1) * pageSize

    const try_data = await db
      .$transaction([
        db.accessLog.count(),
        db.accessLog.findMany({
          where: filter,
          include,
          skip: offset,
          take: pagination.pageSize,
        })
      ])
      .then(Ok)
      .catch(err => {
        if (err instanceof PrismaClientKnownRequestError) return Err(AppError.new(StatusCode.BadRequest, (err.meta as any).message))
        return Err(AppError.new(StatusCode.InternalServerError, err?.message))
      })

    return try_data
  }


  // Delete implements
  async delete(id: string): Promise<Result<AccessLog, AppError>> {
    const try_delete = await db.accessLog
      .delete({
        where: { id }
      })
      .then(Ok)
      .catch(err => {
        if (err instanceof PrismaClientKnownRequestError) return Err(AppError.new(StatusCode.BadRequest, (err.meta as any).message))
        return Err(AppError.new(StatusCode.InternalServerError, err?.message))
      })

    return try_delete
  }
}
