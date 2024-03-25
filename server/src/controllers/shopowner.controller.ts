import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateShopownerInput,
  DeleteMultiShopownersInput,
  GetShopownerInput,
  UpdateShopownerInput,
} from "../schemas/shopowner.schema";
import { checkUser } from "../services/checkUser";
import { ShopownerService } from "../services/shopowner";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import {
  HttpDataResponse,
  HttpListResponse,
  HttpResponse,
} from "../utils/helper";

const service = ShopownerService.new();

export async function getShopownersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, name, remark } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, users, exchanges } =
      convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const [count, shopowners] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          id,
          name,
          remark,
        },
        include: {
          _count,
          users,
          exchanges,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpListResponse(shopowners, count, {
        meta: {
          filter: { id, name, remark },
          include: { _count, users, exchanges },
          page,
          pageSize,
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function getShopownerHandler(
  req: Request<GetShopownerInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { shopownerId } = req.params;
    const { _count, users, exchanges } =
      convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const shopowner = (await service.tryFindUnique({
      where: { id: shopownerId },
      include: { _count, users, exchanges },
    })).ok_or_throw()!;

    // Create audit log
    if (shopowner && sessionUser) {
      (await service.audit(sessionUser)).ok_or_throw();
    }

    res.status(StatusCode.OK).json(
      HttpDataResponse({ shopowner }, {
        meta: {
          id: shopowner.id,
          include: { _count, users, exchanges },
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function createMultiShopownersHandler(
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

    const shopowners = (await service.tryExcelUpload(excelFile))
      .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(shopowners));
  } catch (err) {
    next(err);
  }
}

export async function createShopownerHandler(
  req: Request<{}, {}, CreateShopownerInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, remark } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const shopowner = (await service.tryCreate({
      data: {
        name,
        remark,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(
      HttpDataResponse({ shopowner }, { meta: { id: shopowner.id } }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteShopownerHandler(
  req: Request<GetShopownerInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shopownerId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const shopowner =
      (await service.tryDelete({ where: { id: shopownerId } }))
        .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ shopowner }, { meta: { id: shopowner.id } }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiShopownersHandler(
  req: Request<{}, {}, DeleteMultiShopownersInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shopownerIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const tryDeleteMany = await service.tryDeleteMany({
      where: {
        id: {
          in: shopownerIds,
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

export async function updateShopownerHandler(
  req: Request<
    UpdateShopownerInput["params"],
    {},
    UpdateShopownerInput["body"]
  >,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shopownerId } = req.params;
    const { name } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Update,
    );
    _isAccess.ok_or_throw();

    const shopowner = (await service.tryUpdate({
      where: {
        id: shopownerId,
      },
      data: {
        name,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ shopowner }, { meta: { id: shopowner.id } }),
    );
  } catch (err) {
    next(err);
  }
}
