import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import mapValues from "lodash/mapValues";
import { orderPermission, productPermission, regionPermission, townshipPermission, userAddressPermission, userPermission } from "../utils/auth/permissions";
import { HttpDataResponse } from "../utils/helper";
import { brandPermission } from "../utils/auth/permissions/brand.permission";
import { categoryPermission } from "../utils/auth/permissions/category.permission";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";
import { exchangePermission } from "../utils/auth/permissions/exchange.permission";
import { accessLogPermission } from "../utils/auth/permissions/accessLog.permission";
import { couponPermission } from "../utils/auth/permissions/coupon.permisson";


export async function permissionsUserHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(userPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "user" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsExchangeHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(exchangePermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "user" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsProductsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(productPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "product" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsBrandsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(brandPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "brand" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsCategoriesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(categoryPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "category" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsSalesCategoriesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(salesCategoryPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "sales-category" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsAccessLogsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(accessLogPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "access-logs" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsOrdersHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(orderPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "orders" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsUserAddressHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(userAddressPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "user-address" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsTownshipsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(townshipPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "townships" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsRegionsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(regionPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "regions" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function permissionsCouponsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(couponPermission, value => value())

    res
      .status(200)
      .json(HttpDataResponse({ permissions, label: "coupons" }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
