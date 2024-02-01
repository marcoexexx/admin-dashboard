import { EventActionType, Prisma, PrismaClient } from "@prisma/client";
import redisClient from "./connectRedis";
import logging from "../middleware/logging/logging";


const THROTTLE_TIME = 60 * 5 // 5 minute

export async function createEventAction(db: PrismaClient, data: Prisma.EventActionCreateManyInput) {
  const key = `${data.resource}:${data.action}:${JSON.stringify(data.resourceIds)}`

  const throttle = await redisClient.get(key)

  if (throttle) return

  if (data.action === EventActionType.Read) {
    await redisClient.setEx(key, THROTTLE_TIME, "throttle")
  }

  const log = await db.eventAction.create({
    data
  })

  logging.info("Audit log create")

  return log
}
