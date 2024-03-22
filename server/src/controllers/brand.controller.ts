import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateBrandInput,
  DeleteMultiBrandsInput,
  GetBrandInput,
  UpdateBrandInput,
} from "../schemas/brand.schema";
import { BrandService } from "../services/brand";
import { checkUser } from "../services/checkUser";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";

const service = BrandService.new();

export async function getBrandsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, name } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, products } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const [count, brands] = (await service.tryFindManyWithCount(
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
          products,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(brands, count));
  } catch (err) {
    next(err);
  }
}

export async function getBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { brandId } = req.params;
    const { _count, products } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const brand = (await service.tryFindUnique({
      where: { id: brandId },
      include: { _count, products },
    })).ok_or_throw();

    // Create audit log
    if (brand && sessionUser) (await service.audit(sessionUser)).ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }));
  } catch (err) {
    next(err);
  }
}

export async function createMultiBrandsHandler(
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

    const brands = (await service.tryExcelUpload(excelFile)).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(brands));
  } catch (err) {
    next(err);
  }
}

export async function createBrandHandler(
  req: Request<{}, {}, CreateBrandInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const brand = (await service.tryCreate({ data: { name } })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpDataResponse({ brand }));
  } catch (err) {
    next(err);
  }
}

export async function deleteBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { brandId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const brand = (await service.tryDelete({ where: { id: brandId } })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }));
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiBrandsHandler(
  req: Request<{}, {}, DeleteMultiBrandsInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { brandIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const tryDeleteMany = await service.tryDeleteMany({
      where: {
        id: {
          in: brandIds,
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

export async function updateBrandHandler(
  req: Request<UpdateBrandInput["params"], {}, UpdateBrandInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { brandId } = req.params;
    const { name } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update);
    _isAccess.ok_or_throw();

    const brand = (await service.tryUpdate({ where: { id: brandId }, data: { name } }))
      .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }));
  } catch (err) {
    next(err);
  }
}
