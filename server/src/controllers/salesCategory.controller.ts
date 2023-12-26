import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateMultiSalesCategoriesInput, CreateSalesCategoryInput, DeleteMultiSalesCategoriesInput, GetSalesCategoryInput, SalesCategoryFilterPagination, UpdateSalesCategoryInput } from "../schemas/salesCategory.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from 'fs'
import logging from "../middleware/logging/logging";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";


export async function getSalesCategoriesHandler(
  req: Request<{}, {}, {}, SalesCategoryFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as SalesCategoryFilterPagination["include"]
    const {
      id,
      name
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, categories] = await db.$transaction([
      db.salesCategory.count(),
      db.salesCategory.findMany({
        where: {
          id,
          name
        },
        orderBy,
        skip: offset,
        take: pageSize,
        include
      })
    ])

    res.status(200).json(HttpListResponse(categories, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as SalesCategoryFilterPagination["include"]

    const salesCategory = await db.salesCategory.findUnique({
      where: {
        id: salesCategoryId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ salesCategory }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createSalesCategoryHandler(
  req: Request<{}, {}, CreateSalesCategoryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body
    const category = await db.salesCategory.create({
      data: { name },
    })

    res.status(201).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Sales category already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiSalesCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiSalesCategoriesInput

    // Update not affected
    await Promise.all(data.map(salesCategory => db.salesCategory.upsert({
      where: {
        name: salesCategory.name
      },
      create: {
        name: salesCategory.name,
      },
      update: {}
    })))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Sales Category already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryId } = req.params
    await db.salesCategory.delete({
      where: {
        id: salesCategoryId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiSalesCategoriesHandler(
  req: Request<{}, {}, DeleteMultiSalesCategoriesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryIds } = req.body
    await db.salesCategory.deleteMany({
      where: {
        id: {
          in: salesCategoryIds
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



export async function updateSalesCategoryHandler(
  req: Request<UpdateSalesCategoryInput["params"], {}, UpdateSalesCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryId } = req.params
    const data = req.body

    const category = await db.salesCategory.update({
      where: {
        id: salesCategoryId,
      },
      data
    })

    res.status(200).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
