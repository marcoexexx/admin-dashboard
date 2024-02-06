import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateBrandInput, DeleteMultiBrandsInput, GetBrandInput, UpdateBrandInput } from "../schemas/brand.schema";
import { EventActionType, Resource } from "@prisma/client";
import { BrandService } from "../services/brand";
import { StatusCode } from "../utils/appError";
import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";



const service = BrandService.new()


export async function getBrandsHandler(
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

    const [count, brands] = (await service.find({
      filter: {
        id,
        name
      },
      pagination: {
        page,
        pageSize,
      },
      include: {
        _count,
        products
      },
      orderBy
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(brands, count))
  } catch (err) {
    next(err)
  }
}


export async function getBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionUser = checkUser(req?.user).ok()
    const query = convertNumericStrings(req.query)

    const { brandId } = req.params
    const { _count, products } = convertStringToBoolean(query.include) ?? {}

    const brand = (await service.findUnique(brandId, { _count, products })).ok_or_throw()

    // Read event action audit log
    if (brand) {
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser.id,
        resource: Resource.Brand,
        resourceIds: [brand.id],
        action: EventActionType.Read
      })
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiBrandsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(StatusCode.NoContent)

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const brands = (await service.excelUpload(excelFile)).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      resource: Resource.Brand,
      userId: sessionUser.id,
      action: EventActionType.Create,
      resourceIds: brands.map(brand => brand.id),
    })

    res.status(StatusCode.Created).json(HttpListResponse(brands))
  } catch (err) {
    next(err)
  }
}


export async function createBrandHandler(
  req: Request<{}, {}, CreateBrandInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const brand = (await service.create({ name })).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ brand }))
  } catch (err) {
    next(err)
  }
}


export async function deleteBrandHandler(
  req: Request<GetBrandInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const brand = (await service.delete(brandId)).ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiBrandsHandler(
  req: Request<{}, {}, DeleteMultiBrandsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const tryDeleteMany = await service.deleteMany({
      filter: {
        id: {
          in: brandIds
        }
      }
    })
    tryDeleteMany.ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Brand,
      resourceIds: brandIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function updateBrandHandler(
  req: Request<UpdateBrandInput["params"], {}, UpdateBrandInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { brandId } = req.params
    const { name } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const brand = (await service.update({ filter: {id: brandId}, payload: { name } })).ok_or_throw()

    // Update event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Brand,
      resourceIds: [brand.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ brand }))
  } catch (err) {
    next(err)
  }
}
