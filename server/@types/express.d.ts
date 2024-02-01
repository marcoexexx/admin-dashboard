import { User } from "@prisma/client"

declare global {
  namespace Express {
    export interface Request {
      user?: User,
      files?: Express.Multer.File[],
      useragent: {
        platform: string,
        browser: string,
        version: string
      }
    }
  }
}

