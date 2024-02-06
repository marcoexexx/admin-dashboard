import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { db } from "../utils/db";
import { generateCouponLabel } from "../utils/generateCouponLabel";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { NextFunction, Request, Response } from "express";
import { CreateCouponInput, DeleteMultiCouponsInput, GetCouponInput, UpdateCouponInput } from "../schemas/coupon.schema";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { EventActionType, Resource } from "@prisma/client";
import { CouponService } from "../services/coupon";
import { StatusCode } from "../utils/appError";


const service = CouponService.new()


export async function getCouponsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, points, dolla, productId, isUsed, expiredDate } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { reward, product } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const [count, coupons] = (await service.find({
      filter: {
        id,
        points,
        dolla,
        productId,
        isUsed: isUsed === "true" ? true : false,
        expiredDate
      },
      pagination: {
        page,
        pageSize
      },
      include: {
        reward,
        product
      },
      orderBy
    })).ok_or_throw()

    return res.status(StatusCode.OK).json(HttpListResponse(coupons, count))
  } catch (err) {
    next(err)
  }
}


export async function getCouponHandler(
  req: Request<GetCouponInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { couponId } = req.params
    const { reward, product } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const coupon = (await service.findUnique(couponId, { reward, product })).ok_or_throw()

    // Read event action audit log
    if (coupon) {
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser.id,
        resource: Resource.Coupon,
        resourceIds: [coupon.id],
        action: EventActionType.Read
      })
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }))
  } catch (err) {
    next(err)
  }
}


export async function createCouponHandler(
  req: Request<{}, {}, CreateCouponInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { points, dolla, productId, isUsed, expiredDate } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const coupon = (await service.create({
      points,
      dolla,
      productId,
      label: generateCouponLabel(),
      isUsed,
      expiredDate
    })).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Coupon,
      resourceIds: [coupon.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ coupon }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiCouponsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(StatusCode.NoContent)
    
    const sessionUser = checkUser(req?.user).ok_or_throw()
    const coupons = (await service.excelUpload(excelFile)).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Coupon,
      resourceIds: coupons.map(coupon => coupon.id),
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpListResponse(coupons))
  } catch (err) {
    next(err)
  }
}


export async function deleteCouponHandler(
  req: Request<GetCouponInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const coupon = (await service.delete(couponId)).ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Coupon,
      resourceIds: [coupon.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiCouponsHandler(
  req: Request<{}, {}, DeleteMultiCouponsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _tryDeleteCoupons = await service.deleteMany({
      filter: {
        id: {
          in: couponIds
        }
      }
    })
    _tryDeleteCoupons.ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Coupon,
      resourceIds: couponIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function updateCouponHandler(
  req: Request<UpdateCouponInput["params"], {}, UpdateCouponInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponId } = req.params
    const { points, dolla, isUsed, rewardId, productId, expiredDate } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const coupon = (await service.update({
      filter: {
        id: couponId
      },
      payload: {
        points,
        dolla,
        isUsed,
        rewardId,
        expiredDate,
        productId
      }
    })).ok_or_throw()

    // Update event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Coupon,
      resourceIds: [coupon.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ coupon }))
  } catch (err) {
    next(err)
  }
}
