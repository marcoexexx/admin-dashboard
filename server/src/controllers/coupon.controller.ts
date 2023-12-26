import { NextFunction, Request, Response } from "express";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { CouponFilterPagination, CreateCouponInput, CreateMultiCouponsInput, DeleteMultiCouponsInput, GetCouponInput, UpdateCouponInput } from "../schemas/coupon.schema";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { parseExcel } from "../utils/parseExcel";
import fs from 'fs'
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { generateCouponLabel } from "../utils/generateCouponLabel";


export async function getCouponsHandler(
  req: Request<{}, {}, {}, CouponFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as CouponFilterPagination["include"]
    const {
      id,
      points,
      dolla,
      productId,
      isUsed,
      expiredDate
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [coupons, count] = await db.$transaction([
      db.coupon.findMany({
        where: {
          id,
          points,
          dolla,
          productId,
          isUsed: isUsed === "true" ? true : false,
          expiredDate
        },
        orderBy,
        skip: offset,
        take: pageSize,
        include
      }),
      db.coupon.count()
    ])

    return res.status(200).json(HttpListResponse(coupons, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getCouponHandler(
  req: Request<GetCouponInput["params"] & Pick<CouponFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as CouponFilterPagination["include"]

    const coupon = await db.coupon.findUnique({
      where: {
        id: couponId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ coupon }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createCouponHandler(
  req: Request<{}, {}, CreateCouponInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { points, dolla, productId, isUsed, expiredDate } = req.body
    const coupon = await db.coupon.create({
      data: {
        points,
        dolla,
        productId,
        label: generateCouponLabel(),
        isUsed,
        expiredDate
      },
    })

    res.status(200).json(HttpDataResponse({ coupon }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Coupon already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiCouponsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiCouponsInput

    // Update not affected
    await Promise.all(data.map(({label, points, dolla, isUsed, expiredDate}) => db.coupon.upsert({
      where: {
        label
      },
      create: {
        points,
        dolla,
        isUsed,
        expiredDate,
        label
      },
      update: {}
    })))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Coupon already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteCouponHandler(
  req: Request<GetCouponInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponId } = req.params
    await db.coupon.delete({
      where: {
        id: couponId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiCouponsHandler(
  req: Request<{}, {}, DeleteMultiCouponsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponIds } = req.body
    await db.coupon.deleteMany({
      where: {
        id: {
          in: couponIds
        }
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateCouponHandler(
  req: Request<UpdateCouponInput["params"], {}, UpdateCouponInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { couponId } = req.params
    const data = req.body

    const coupon = await db.coupon.update({
      where: {
        id: couponId,
      },
      data
    })

    res.status(200).json(HttpDataResponse({ coupon }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
