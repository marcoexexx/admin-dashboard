import { OperationAction, Permission, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { checkUser } from "../services/checkUser";
import { UserService } from "../services/user";

import AppError, { StatusCode } from "../utils/appError";

const service = UserService.new();

export async function _checkPermission({ action, resource }: { action: OperationAction; resource: Resource; }) {
  return async function(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const sessionUser = checkUser(req?.user).ok_or_throw();

      if (sessionUser.isSuperuser) return next();

      const perms: Permission[] | undefined = (await service.tryFindUnique({
        where: { id: sessionUser.id },
        include: { role: { include: { permissions: true } } },
        // @ts-ignore
      })).ok_or_throw()?.role?.permissions;

      const isAccess = perms?.some(perm => perm.action === action && perm.resource === resource);
      if (!isAccess) {
        return next(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`));
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
