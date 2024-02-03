import AppError, { StatusCode } from "../utils/appError";
import roleBasedAccess from "../utils/auth/permissions";

import { NextFunction, Request, Response } from "express";
import { Action, Permission } from "../utils/auth/rbac";
import { Role } from "../schemas/user.schema";
import { checkUser } from "../services/checkUser";


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
        const sessionUser = checkUser(req?.user).ok()

        const isAllowed = roleBasedAccess.isAuthenticated(perm, sessionUser?.role || "*", action)

        if (!isAllowed) return next(AppError.new(StatusCode.BadRequest, `You do not have permission to access this resource.`))

        next()
      } catch (err: any) {
        next(err)
      }
    }
}

