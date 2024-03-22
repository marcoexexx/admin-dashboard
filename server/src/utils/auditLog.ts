import logging from "../middleware/logging/logging";
import AppError, { StatusCode } from "./appError";
import redisClient from "./connectRedis";
import Result, { Err, Ok } from "./result";

import { AuditLog, OperationAction, Prisma } from "@prisma/client";
import { db } from "./db";

const THROTTLE_TIME = 60 * 5; // 5 minute

// Handle audit logs
export async function createAuditLog(
  data: Prisma.AuditLogUncheckedCreateInput,
): Promise<Result<AuditLog | undefined, AppError>> {
  if (
    !data.resourceIds
    || (Array.isArray(data.resourceIds) && !data.resourceIds.length)
  ) {
    return Ok(undefined);
  }

  const key = `${data.resource}:${data.action}:${
    JSON.stringify(data.resourceIds)
  }`;

  const throttle = await redisClient.get(key);

  if (throttle) {
    return Err(
      AppError.new(
        StatusCode.NotModified,
        `Audit log creation skipped due to throttling. Same item found in cache. Retry in ${
          THROTTLE_TIME / 60
        } minutes.`,
      ),
    );
  }

  if (data.action === OperationAction.Read) {
    await redisClient.setEx(key, THROTTLE_TIME, "throttle");
  }

  const log = await db.auditLog.create({
    data,
  });

  logging.info("Audit log create");

  return Ok(log);
}
