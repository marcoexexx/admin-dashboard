import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateProductSalesCategoryInput,
  CreateSalesCategoryInput,
  DeleteMultiSalesCategoriesInput,
  GetSalesCategoryInput,
  UpdateSalesCategoryInput,
} from "../schemas/salesCategory.schema";
import { checkUser } from "../services/checkUser";
import { ProductSalesCategoryService } from "../services/productSalesCategory";
import { SalesCategoryService } from "../services/saleCategory";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";

const service = SalesCategoryService.new();
const _salesService = ProductSalesCategoryService.new();

// TODO: sales-categories filter
export async function getSalesCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, name } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, products } = convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const [count, categories] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: { id, name },
        include: { _count, products },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(categories, count));
  } catch (err) {
    next(err);
  }
}

export async function getSalesCategoriesInProductHandler(
  req: Request<CreateProductSalesCategoryInput["params"], {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const [count, salesCategories] = (await _salesService.tryFindManyWithCount(
      {
        pagination: { page: 1, pageSize: 10 },
      },
      {
        where: { productId },
        include: { salesCategory: true },
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(HttpListResponse(salesCategories, count));
  } catch (err) {
    next(err);
  }
}

export async function getSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { salesCategoryId } = req.params;
    const { _count, products } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const salesCategory =
      (await service.tryFindUnique({ where: { id: salesCategoryId }, include: { _count, products } })).ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ salesCategory }));
  } catch (err) {
    next(err);
  }
}

export async function createSalesCategoryHandler(
  req: Request<{}, {}, CreateSalesCategoryInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, startDate, endDate, description } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const category = (await service.tryCreate({
      data: {
        name,
        startDate,
        endDate,
        description,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpDataResponse({ category }));
  } catch (err) {
    next(err);
  }
}

export async function createSaleCategoryForProductHandler(
  req: Request<CreateProductSalesCategoryInput["params"], {}, CreateProductSalesCategoryInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const { discount, salesCategoryId } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const category = (await _salesService.tryCreate({
      data: {
        salesCategoryId,
        productId,
        discount,
      },
      include: {
        salesCategory: true,
      },
    })).ok_or_throw();

    res.status(StatusCode.Created).json(HttpDataResponse({ category }));
  } catch (err) {
    next(err);
  }
}

export async function createMultiSalesCategoriesHandler(
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

    const categories = (await service.tryExcelUpload(excelFile)).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(categories));
  } catch (err) {
    next(err);
  }
}

export async function deleteSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { salesCategoryId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const category = (await service.tryDelete({ where: { id: salesCategoryId } })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ category }));
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiSalesCategoriesHandler(
  req: Request<{}, {}, DeleteMultiSalesCategoriesInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { salesCategoryIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const _deleteSalesCategories = await service.tryDeleteMany({
      where: {
        id: {
          in: salesCategoryIds,
        },
      },
    });
    _deleteSalesCategories.ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"));
  } catch (err) {
    next(err);
  }
}

export async function updateSalesCategoryHandler(
  req: Request<UpdateSalesCategoryInput["params"], {}, UpdateSalesCategoryInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { salesCategoryId } = req.params;
    const { name, startDate, endDate, isActive, description } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update);
    _isAccess.ok_or_throw();

    const category = (await service.tryUpdate({
      where: { id: salesCategoryId },
      data: {
        name,
        startDate,
        endDate,
        isActive,
        description,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ category }));
  } catch (err) {
    next(err);
  }
}
