import { StatusCode } from "../utils/appError";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse } from "../utils/helper";
import { potentialOrderPermission, orderPermission, productPermission, regionPermission, townshipPermission, userAddressPermission, userPermission, pickupAddressPermission, dashboardPermission } from "../utils/auth/permissions";
import { brandPermission } from "../utils/auth/permissions/brand.permission";
import { categoryPermission } from "../utils/auth/permissions/category.permission";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";
import { exchangePermission } from "../utils/auth/permissions/exchange.permission";
import { accessLogPermission } from "../utils/auth/permissions/accessLog.permission";
import { couponPermission } from "../utils/auth/permissions/coupon.permisson";

import mapValues from "lodash/mapValues";
import { auditLogPermission } from "../utils/auth/permissions/auditLog.permission";


export async function permissionsDashboardHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(dashboardPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "dashboard" }))
  } catch (err) {
    next(err)
  }
}


export async function permissionsUserHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(userPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "user" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "exchange" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "product" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "brand" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "category" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "sales-category" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "access-log" }))
  } catch (err) {
    next(err)
  }
}


export async function permissionsAuditLogsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(auditLogPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "audit-log" }))
  } catch (err) {
    next(err)
  }
}


export async function permissionsPotetialOrdersHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(potentialOrderPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "potential-order" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "order" }))
  } catch (err) {
    next(err)
  }
}


export async function permissionsPickupAddressHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(pickupAddressPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "pickup-addresse" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "addresse" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "township" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "region" }))
  } catch (err) {
    next(err)
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
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: "coupon" }))
  } catch (err) {
    next(err)
  }
}
