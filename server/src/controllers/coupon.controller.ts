import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateCouponInput,
  DeleteMultiCouponsInput,
  GetCouponInput,
  UpdateCouponInput,
} from "../schemas/coupon.schema";
import { checkUser } from "../services/checkUser";
import { CouponService } from "../services/coupon";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { generateLabel } from "../utils/generateCouponLabel";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";

const service = CouponService.new();

export async function getCouponsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, points, dolla, productId, isUsed, expiredDate } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { reward, product } = convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const [count, coupons] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          id,
          points,
          dolla,
          productId,
          isUsed: isUsed === "true" ? true : false,
          expiredDate,
        },
        include: { reward, product },
        orderBy,
      },
    )).ok_or_throw();

    return res.status(StatusCode.OK).json(HttpListResponse(coupons, count));
  } catch (err) {
    next(err);
  }
}

export async function getCouponHandler(
  req: Request<GetCouponInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { couponId } = req.params;
    const { reward, product } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read);
    _isAccess.ok_or_throw();

    const coupon = (await service.tryFindUnique({ where: { id: couponId }, include: { reward, product } }))
      .ok_or_throw();

    // Create audit log
    if (coupon && sessionUser) (await service.audit(sessionUser)).ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }));
  } catch (err) {
    next(err);
  }
}

export async function createCouponHandler(
  req: Request<{}, {}, CreateCouponInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { points, dolla, productId, isUsed, expiredDate } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create);
    _isAccess.ok_or_throw();

    const coupon = (await service.tryCreate({
      data: {
        points,
        dolla,
        productId,
        label: generateLabel("coupon"),
        isUsed,
        expiredDate,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpDataResponse({ coupon }));
  } catch (err) {
    next(err);
  }
}

export async function createMultiCouponsHandler(
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

    const coupons = (await service.tryExcelUpload(excelFile)).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(coupons));
  } catch (err) {
    next(err);
  }
}

export async function deleteCouponHandler(
  req: Request<GetCouponInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { couponId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const coupon = (await service.tryDelete({ where: { id: couponId } })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }));
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiCouponsHandler(
  req: Request<{}, {}, DeleteMultiCouponsInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { couponIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete);
    _isAccess.ok_or_throw();

    const _tryDeleteCoupons = await service.tryDeleteMany({
      where: {
        id: {
          in: couponIds,
        },
      },
    });
    _tryDeleteCoupons.ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"));
  } catch (err) {
    next(err);
  }
}

export async function updateCouponHandler(
  req: Request<UpdateCouponInput["params"], {}, UpdateCouponInput["body"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { couponId } = req.params;
    const { points, dolla, isUsed, rewardId, productId, expiredDate } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update);
    _isAccess.ok_or_throw();

    const coupon = (await service.tryUpdate({
      where: {
        id: couponId,
      },
      data: {
        points,
        dolla,
        isUsed,
        rewardId,
        expiredDate,
        productId,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }));
  } catch (err) {
    next(err);
  }
}
