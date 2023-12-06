import { IUser } from "../src/schemas/user.schema"

declare global {
  namespace Express {
    export interface Request {
      user?: IUser,
      files?: Express.Multer.File[],
      useragent: {
        platform: string,
        browser: string,
        version: string
      }
    }
  }
}

