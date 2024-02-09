import { AuditLogAction, Prisma } from "@prisma/client";
import redisClient from "./connectRedis";
import logging from "../middleware/logging/logging";
import { db } from "./db";


const THROTTLE_TIME = 60 * 5 // 5 minute

export async function createAuditLog(data: Prisma.AuditLogCreateInput) {
  const key = `${data.resource}:${data.action}:${JSON.stringify(data.resourceIds)}`

  const throttle = await redisClient.get(key)

  if (throttle) return

  if (data.action === AuditLogAction.Read) {
    await redisClient.setEx(key, THROTTLE_TIME, "throttle")
  }

  const log = await db.auditLog.create({
    data
  })

  logging.info("Audit log create")

  return log
}
