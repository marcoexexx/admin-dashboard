import { EventAction, Prisma, PrismaClient } from "@prisma/client";

export async function createEventAction(db: PrismaClient, data: Prisma.EventActionCreateManyInput): Promise<EventAction> {
  const log = await db.eventAction.create({
    data
  })

  return log
}
