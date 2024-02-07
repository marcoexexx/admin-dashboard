import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateProductSalesCategoryInput, CreateSalesCategoryInput, DeleteMultiSalesCategoriesInput, GetSalesCategoryInput, UpdateSalesCategoryInput } from "../schemas/salesCategory.schema";
import { EventActionType, Resource } from "@prisma/client";
import { SalesCategoryService } from "../services/saleCategory";
import { ProductSalesCategoryService } from "../services/productSalesCategory";
import { StatusCode } from "../utils/appError";


const service = SalesCategoryService.new()
const productSalesCategoriesService = ProductSalesCategoryService.new()


// TODO: sales-categories filter
export async function getSalesCategoriesHandler(
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


export async function getSalesCategoriesInProductHandler(
  req: Request<CreateProductSalesCategoryInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params

    const salesCategories = (await productSalesCategoriesService.findMany({
      where: { productId },
      include: { salesCategory: true }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(salesCategories))
  } catch (err) {
    next(err)
  }
}


export async function getSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { salesCategoryId } = req.params
    const { _count, products } = convertStringToBoolean(query.include) ?? {}

    const salesCategory = (await service.findUnique(salesCategoryId, { _count, products })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ salesCategory }))
  } catch (err) {
    next(err)
  }
}


export async function createSalesCategoryHandler(
  req: Request<{}, {}, CreateSalesCategoryInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, startDate, endDate, description } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.create({
      name,
      startDate,
      endDate,
      description
    })).ok_or_throw()

    // Create event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.SalesCategory,
      resourceIds: [category.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}


export async function createSaleCategoryForProductHandler(
  req: Request<CreateProductSalesCategoryInput["params"], {}, CreateProductSalesCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params
    const { discount, salesCategoryId } = req.body

    const category = (await productSalesCategoriesService.create({
      salesCategoryId,
      productId,
      discount
    })).ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiSalesCategoriesHandler(
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
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.SalesCategory,
      resourceIds: categories.map(category => category.id),
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpListResponse(categories))
  } catch (err) {
    next(err)
  }
}


export async function deleteSalesCategoryHandler(
  req: Request<GetSalesCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.delete(salesCategoryId)).ok_or_throw()

    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.SalesCategory,
      resourceIds: [category.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiSalesCategoriesHandler(
  req: Request<{}, {}, DeleteMultiSalesCategoriesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _deleteSalesCategories = await service.deleteMany({
      filter: {
        id: {
          in: salesCategoryIds
        }
      }
    })
    _deleteSalesCategories.ok_or_throw()

    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.SalesCategory,
      resourceIds: salesCategoryIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}



export async function updateSalesCategoryHandler(
  req: Request<UpdateSalesCategoryInput["params"], {}, UpdateSalesCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salesCategoryId } = req.params
    const { name, startDate, endDate, isActive, description } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const category = (await service.update({
      filter: { id: salesCategoryId },
      payload: {
        name,
        startDate,
        endDate,
        isActive,
        description
      }
    })).ok_or_throw()

    // Update event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.SalesCategory,
      resourceIds: [category.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}
