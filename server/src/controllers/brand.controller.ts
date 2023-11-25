import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { BrandFilterPagination, CreateBrandInput, GetBrandInput } from "../schemas/brand.schema";
import { convertNumericStrings } from "../utils/convertNumber";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export async function getBrandsHandler(
  req: Request<{}, {}, {}, BrandFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination } = convertNumericStrings(req.query)
    const {
      id,
      name
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const brands = await db.brand.findMany({
      where: {
        id,
        name
      },
      skip: offset,
      take: pageSize,
    })

    res.status(200).json(HttpListResponse(brands))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params

    const brand = await db.brand.findUnique({
      where: {
        id: brandId
      }
    })

    res.status(200).json(HttpDataResponse(brand))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createBrandHandler(
  req: Request<{}, {}, CreateBrandInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body
    // TODO: filter
    const brand = await db.brand.create({
      data: { name },
    })

    res.status(200).json(HttpDataResponse({ brand }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Brand already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params
    await db.brand.delete({
      where: {
        id: brandId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
