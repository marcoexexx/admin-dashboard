import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateCategoryInput, DeleteMultiCategoriesInput, GetCategoryInput, UpdateCategoryInput } from "../schemas/category.schema";
import { CategoryService } from "../services/category";
import { StatusCode } from "../utils/appError";
import { OperationAction } from "@prisma/client";


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

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const [count, categories] = (await service.tryFindManyWithCount(
      {
        pagination: {page, pageSize}
      },
      {
        where: {id, name},
        include: {_count, products},
        orderBy
      }
    )).ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const category = (await service.tryFindUnique({ where: {id: categoryId}, include: {_count, products} })).ok_or_throw()

    // Create audit log
    if (category && sessionUser) (await service.audit(sessionUser)).ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const category = (await service.tryCreate({ data: {name} })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const categories = (await service.tryExcelUpload(excelFile)).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpListResponse(categories))
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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const category = (await service.tryDelete({ where: {id: categoryId} })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const _tryDeleteCategories = await service.tryDeleteMany({
      where: {
        id: {
          in: categoryIds
        }
      }
    })
    _tryDeleteCategories.ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update)
    _isAccess.ok_or_throw()

    const category = (await service.tryUpdate({
      where: {
        id: categoryId
      },
      data: {
        name
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ category }))
  } catch (err) {
    next(err)
  }
}
