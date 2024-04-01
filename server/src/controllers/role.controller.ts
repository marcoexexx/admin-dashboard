import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateRoleInput,
  DeleteMultiRolesInput,
  GetRoleInput,
  UpdateRoleInput,
} from "../schemas/role.schema";
import { checkUser } from "../services/checkUser";
import { RoleService } from "../services/role";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import {
  HttpDataResponse,
  HttpListResponse,
  HttpResponse,
} from "../utils/helper";

const service = RoleService.new();

export async function getRolesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, name } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, permissions } = convertStringToBoolean(query.include)
      ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const [count, roles] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          id,
          name,
        },
        include: {
          _count,
          permissions,
        },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(roles, count, {
      meta: {
        filter: { id, name },
        include: { _count, permissions },
        page,
        pageSize,
      },
    }));
  } catch (err) {
    next(err);
  }
}

export async function getRoleHandler(
  req: Request<GetRoleInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { roleId } = req.params;
    const { _count, permissions } = convertStringToBoolean(query.include)
      ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const role = (await service.tryFindUnique({
      where: { id: roleId },
      include: { _count, permissions },
    })).ok_or_throw()!;

    // Create audit log
    if (role && sessionUser) {
      (await service.audit(sessionUser)).ok_or_throw();
    }

    res.status(StatusCode.OK).json(
      HttpDataResponse({ role }, {
        meta: {
          id: role.id,
          include: { _count, permissions },
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function createMultiRolesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const excelFile = req.file;

    if (!excelFile) return res.status(StatusCode.NoContent);

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const roles = (await service.tryExcelUpload(excelFile)).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(roles));
  } catch (err) {
    next(err);
  }
}

export async function createRoleHandler(
  req: Request<{}, {}, CreateRoleInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, permissions } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const role = (await service.tryCreate({
      data: {
        name,
        permissions: {
          connect: permissions.map(permissionId => ({ id: permissionId })),
        },
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(
      HttpDataResponse({ role }, {
        meta: {
          id: role.id,
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteRoleHandler(
  req: Request<GetRoleInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { roleId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const role = (await service.tryDelete({ where: { id: roleId } }))
      .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ role }, { meta: { id: role.id } }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiRolesHandler(
  req: Request<{}, {}, DeleteMultiRolesInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { roleIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const tryDeleteMany = await service.tryDeleteMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });
    tryDeleteMany.ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpResponse(StatusCode.OK, "Success deleted"),
    );
  } catch (err) {
    next(err);
  }
}

export async function updateRoleHandler(
  req: Request<UpdateRoleInput["params"], {}, UpdateRoleInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { roleId } = req.params;
    const { name, permissions } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Update,
    );
    _isAccess.ok_or_throw();

    const role = (await service.tryUpdate({
      where: {
        id: roleId,
      },
      data: {
        name,
        permissions: {
          set: permissions.map(permissionId => ({ id: permissionId })),
        },
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ role }, { meta: { id: role.id } }),
    );
  } catch (err) {
    next(err);
  }
}
