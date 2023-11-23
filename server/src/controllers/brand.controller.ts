import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateBrandInput, GetBrandInput } from "../schemas/brand.schema";


export async function getBrandsHandler(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: filter
    const brands = await db.brand.findMany()

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
