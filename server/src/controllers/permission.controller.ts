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
import { auditLogPermission } from "../utils/auth/permissions/auditLog.permission";

import mapValues from "lodash/mapValues";


const PermissionResource = {
  AccessLog: "access-logs",
  AuditLog: "audit-logs",
  Brand: "brands",
  Category: "categories",
  Coupon: "coupons",
  Exchange: "exchanges",
  Order: "orders",
  PickupAddress: "pickup-addresses",
  PotentialOrder: "potential-orders",
  Product: "products",
  Region: "regions",
  SalesCategory: "sales-categories",
  Township: "townships",
  UserAddress: "user-addresses",
  User: "users",
  AuthUser: "authUser",
  Dashboard: "dashboard"
} as const


export async function permissionsDashboardHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const permissions = mapValues(dashboardPermission, value => value())

    res
      .status(StatusCode.OK)
      .json(HttpDataResponse({ permissions, label: PermissionResource.Dashboard }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.User }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Exchange }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Product }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Brand }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Category }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.SalesCategory }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.AccessLog }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.AuditLog }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.PotentialOrder }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Order }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.PickupAddress }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.UserAddress }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Township }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Region }))
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
      .json(HttpDataResponse({ permissions, label: PermissionResource.Coupon }))
  } catch (err) {
    next(err)
  }
}
