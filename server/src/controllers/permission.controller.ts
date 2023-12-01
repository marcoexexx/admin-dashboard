import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import mapValues from "lodash/mapValues";
import { productPermission, userPermission } from "../utils/auth/permissions";
import { HttpDataResponse } from "../utils/helper";
import { brandPermission } from "../utils/auth/permissions/brand.permission";
import { categoryPermission } from "../utils/auth/permissions/category.permission";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";


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
