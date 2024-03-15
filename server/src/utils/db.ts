import { PrismaClient } from "@prisma/client";
import getConfig from "./getConfig";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (getConfig("nodeEnv") === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
