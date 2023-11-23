import { NextFunction, Request, Response } from "express";
import logging from "./logging/logging";
import AppError from "../utils/appError";
import { Action, Permission } from "../utils/auth/rbac";
import roleBasedAccess from "../utils/auth/permissions";
import { Role } from "../schemas/user.schema";

export function permissionUser(
  action: Action,
  perm: Permission<Role>
) {
  return (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
      try {
        // @ts-ignore  for mocha testing
        const user = req.user

        const isAllowed = roleBasedAccess.isAuthenticated(perm, user?.role || "*", action)

        if (!isAllowed) return next(new AppError(403, "You do not have permission to access this resource."))

        next()
      } catch (err: any) {
        const msg = err?.message || "internal server error"
        logging.error(msg)
        next(new AppError(500, msg))
      }
    }
}

