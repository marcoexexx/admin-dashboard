import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { BrandFilterPagination, CreateBrandInput, CreateMultiBrandsInput, DeleteMultiBrandsInput, GetBrandInput, UpdateBrandInput } from "../schemas/brand.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EventActionType, Resource } from "@prisma/client";
import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";
import fs from "fs"


export async function getBrandsHandler(
  req: Request<{}, {}, {}, BrandFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as BrandFilterPagination["include"]
    const {
      id,
      name
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, brands] = await db.$transaction([
      db.brand.count(),
      db.brand.findMany({
        where: {
          id,
          name
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(brands, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getBrandHandler(
  req: Request<GetBrandInput["params"] & Pick<BrandFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as BrandFilterPagination["include"]

    const brand = await db.brand.findUnique({
      where: {
        id: brandId
      },
      include
    })

    // Read event action audit log
    if (brand) {
      if (req.user) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.Brand,
        resourceIds: [brand.id],
        action: EventActionType.Read
      })
    }

    res.status(200).json(HttpDataResponse({ brand }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createMultiBrandsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiBrandsInput

    // Update not affected
    const brands = await Promise.all(data.map(brand => db.brand.upsert({
      where: {
        name: brand.name
      },
      create: {
        name: brand.name
      },
      update: {}
    })))

    // Create event action audit log
    if (req.user) createEventAction(db, {
      resource: Resource.Brand,
      userId: req.user.id,
      action: EventActionType.Create,
      resourceIds: brands.map(brand => brand.id),
    })

    res.status(201).json(HttpListResponse(brands))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Brand already exists"))

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

    const brand = await db.brand.create({
      data: { name },
    })

    // Create event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Create
    })

    res.status(201).json(HttpDataResponse({ brand }))
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

    const brand = await db.brand.delete({
      where: {
        id: brandId
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpDataResponse({ brand }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiBrandsHandler(
  req: Request<{}, {}, DeleteMultiBrandsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandIds } = req.body

    await db.brand.deleteMany({
      where: {
        id: {
          in: brandIds
        }
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Brand,
      resourceIds: brandIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateBrandHandler(
  req: Request<UpdateBrandInput["params"], {}, UpdateBrandInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params
    const data = req.body

    const brand = await db.brand.update({
      where: {
        id: brandId,
      },
      data
    })

    // Update event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user?.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ brand }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
