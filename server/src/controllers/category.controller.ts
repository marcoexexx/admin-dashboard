import { parseExcel } from "../utils/parseExcel";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { db } from "../utils/db";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateCategoryInput, CreateMultiCategoriesInput, DeleteMultiCategoriesInput, GetCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EventActionType, Resource } from "@prisma/client";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";
import fs from 'fs'


export async function getCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, name } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { _count, products } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const offset = ((page||1) - 1) * (pageSize||10)

    const [count, categories] = await db.$transaction([
      db.category.count(),
      db.category.findMany({
        where: {
          id,
          name
        },
        orderBy,
        skip: offset,
        take: pageSize,
        include: {
          _count,
          products
        }
      })
    ])

    res.status(200).json(HttpListResponse(categories, count))
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
    const query = convertNumericStrings(req.query)

    const { categoryId } = req.params
    const { _count, products } = convertStringToBoolean(query.include) ?? {}

    const category = await db.category.findUnique({
      where: {
        id: categoryId
      },
      include: {
        _count,
        products
      }
    })

    // Read event action audit log
    if (category) {
      if (req?.user?.id) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.Category,
        resourceIds: [category.id],
        action: EventActionType.Read
      })
    }

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

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Create
    })

    res.status(200).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Category already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiCategoriesInput

    // Update not affected
    const categories = await Promise.all(data.map(category => db.category.upsert({
      where: {
        name: category.name
      },
      create: {
        name: category.name
      },
      update: {}
    })))

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Category,
      resourceIds: categories.map(category => category.id),
      action: EventActionType.Create
    })

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Category already exists"))

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
    
    const category = await db.category.delete({
      where: {
        id: categoryId
      }
    })

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiCategoriesHandler(
  req: Request<{}, {}, DeleteMultiCategoriesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryIds } = req.body

    await db.category.deleteMany({
      where: {
        id: {
          in: categoryIds
        }
      }
    })

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Category,
      resourceIds: categoryIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateCategoryHandler(
  req: Request<UpdateCategoryInput["params"], {}, UpdateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryId } = req.params
    const data = req.body

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data
    })

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ category }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
