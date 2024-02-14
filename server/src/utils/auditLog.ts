import redisClient from "./connectRedis";
import logging from "../middleware/logging/logging";
import Result, { Err, Ok } from "./result";
import AppError, { StatusCode } from "./appError";

import { AuditLog, AuditLogAction, Prisma } from "@prisma/client";
import { db } from "./db";


const THROTTLE_TIME = 60 * 5 // 5 minute

// Handle audit logs
export async function createAuditLog(data: Prisma.AuditLogUncheckedCreateInput): Promise<Result<AuditLog | undefined, AppError>> {
  const key = `${data.resource}:${data.action}:${JSON.stringify(data.resourceIds)}`

  const throttle = await redisClient.get(key)

  if (throttle) return Err(AppError.new(StatusCode.NotModified, `Audit log creation skipped due to throttling. Same item found in cache. Retry in ${THROTTLE_TIME / 60} minutes.`))

  if (data.action === AuditLogAction.Read) {
    await redisClient.setEx(key, THROTTLE_TIME, "throttle")
  }

  const log = await db.auditLog.create({
    data
  })

  logging.info("Audit log create")

  return Ok(log)
}
