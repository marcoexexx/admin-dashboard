import { UserWithRole } from "./type";

declare global {
  namespace Express {
    export interface Request {
      user?: UserWithRole;
      files?: Express.Multer.File[];
      useragent: {
        platform: string;
        browser: string;
        version: string;
      };
    }
  }
}
