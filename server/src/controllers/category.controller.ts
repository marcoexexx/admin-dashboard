import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateCategoryInput, GetCategoryInput } from "../schemas/category.schema";


export async function getCategoriesHandler(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: filter
    const categories = await db.category.findMany({
      where: {}
    })

    res.status(200).json(HttpListResponse(categories))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getCategoryHandler(
  req: Request<GetCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryId } = req.params
    const category = await db.category.findUnique({
      where: {
        id: categoryId
      }
    })

    res.status(200).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createCategoryHandler(
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body
    const category = await db.category.create({
      data: { name },
    })

    res.status(200).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteCategoryHandler(
  req: Request<GetCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryId } = req.params
    await db.category.delete({
      where: {
        id: categoryId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
