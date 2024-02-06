import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { db } from "../utils/db";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateCategoryInput, DeleteMultiCategoriesInput, GetCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { EventActionType, Resource } from "@prisma/client";
import { CategoryService } from "../services/category";

import AppError, { StatusCode } from "../utils/appError";
import logging from "../middleware/logging/logging";


const service = CategoryService.new()


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

    const [count, categories] = (await service.find({
      filter: {
        id,
        name
      },
      pagination: {
        page,
        pageSize
      },
      include: {
        _count,
        products
      },
      orderBy
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(categories, count))
  } catch (err) {
    next(err)
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

    const sessionUser = checkUser(req?.user).ok()
    const category = (await service.findUnique(categoryId, {_count, products})).ok_or_throw()

    // Read event action audit log
    if (category) {
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser.id,
        resource: Resource.Category,
        resourceIds: [category.id],
        action: EventActionType.Read
      })
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}


export async function createCategoryHandler(
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.create({ name })).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(StatusCode.NoContent)

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const categories = (await service.excelUpload(excelFile)).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Category,
      resourceIds: categories.map(category => category.id),
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpResponse(StatusCode.Created, "Success"))
  } catch (err) {
    next(err)
  }
}


export async function deleteCategoryHandler(
  req: Request<GetCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryId } = req.params
    
    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.delete(categoryId)).ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiCategoriesHandler(
  req: Request<{}, {}, DeleteMultiCategoriesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _tryDeleteCategories = await service.deleteMany({
      filter: {
        id: {
          in: categoryIds
        }
      }
    })
    _tryDeleteCategories.ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Category,
      resourceIds: categoryIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function updateCategoryHandler(
  req: Request<UpdateCategoryInput["params"], {}, UpdateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { categoryId } = req.params
    const { name } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.update({
      filter: {
        id: categoryId
      },
      payload: {
        name
      }
    })).ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Category,
      resourceIds: [category.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}
