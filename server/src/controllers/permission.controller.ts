import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreatePermissionInput,
  DeleteMultiPermissionsInput,
  GetPermissionInput,
  UpdatePermissionInput,
} from "../schemas/permission.schema";
import { checkUser } from "../services/checkUser";
import { PermissionService } from "../services/permission";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";

const service = PermissionService.new();

export async function getPermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, action, resource } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { role } = convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const [count, permissions] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          id,
          action,
          resource,
        },
        include: {
          role,
        },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(permissions, count));
  } catch (err) {
    next(err);
  }
}

export async function getPermissionHandler(
  req: Request<GetPermissionInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { permissionId } = req.params;
    const { role } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const permission = (await service.tryFindUnique({
      where: { id: permissionId },
      include: { role },
    })).ok_or_throw();

    // Create audit log
    if (permission && sessionUser) (await service.audit(sessionUser)).ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ permission }));
  } catch (err) {
    next(err);
  }
}

export async function createMultiPermissionsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const excelFile = req.file;

    if (!excelFile) return res.status(StatusCode.NoContent);

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const permissions = (await service.tryExcelUpload(excelFile)).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(permissions));
  } catch (err) {
    next(err);
  }
}

export async function createPermissionHandler(
  req: Request<{}, {}, CreatePermissionInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { action, resource } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const permission = (await service.tryCreate({
      data: {
        action,
        resource,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpDataResponse({ permission }));
  } catch (err) {
    next(err);
  }
}

export async function deletePermissionHandler(
  req: Request<GetPermissionInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { permissionId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const permission = (await service.tryDelete({
      where: {
        id: permissionId,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ permission }));
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiPermissionsHandler(
  req: Request<{}, {}, DeleteMultiPermissionsInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { permissionIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const tryDeleteMany = await service.tryDeleteMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });
    tryDeleteMany.ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"));
  } catch (err) {
    next(err);
  }
}

export async function updatePermissionHandler(
  req: Request<UpdatePermissionInput["params"], {}, UpdatePermissionInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { permissionId } = req.params;
    const { resource, action } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update);
    _isAccess.ok_or_throw();

    const permission = (await service.tryUpdate({
      where: {
        id: permissionId,
      },
      data: {
        action,
        resource,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ permission }));
  } catch (err) {
    next(err);
  }
}
