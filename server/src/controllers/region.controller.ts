import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { CreateRegionInput, DeleteMultiRegionsInput, GetRegionInput, UpdateRegionInput } from "../schemas/region.schema";
import { EventActionType, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { RegionService } from "../services/region";
import { StatusCode } from "../utils/appError";


const service = RegionService.new()


export async function getRegionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, name } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { _count, townships, userAddresses } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const [count, regions] = (await service.find({
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
        townships,
        userAddresses
      },
      orderBy
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(regions, count))
  } catch (err) {
    next(err)
  }
}


export async function getRegionHandler(
  req: Request<GetRegionInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { regionId } = req.params
    const { _count, townships, userAddresses } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const region = (await service.findUnique(regionId, { _count, townships, userAddresses })).ok_or_throw()

    if (region) {
      // Read event action audit log
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser.id,
        resource: Resource.Region,
        resourceIds: [region.id],
        action: EventActionType.Read
      })
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ region }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiRegionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(StatusCode.NoContent)

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const regions = (await service.excelUpload(excelFile)).ok_or_throw()

    // Create event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Region,
      resourceIds: regions.map(region => region.id),
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpListResponse(regions))
  } catch (err) {
    next(err)
  }
}


export async function createRegionHandler(
  req: Request<{}, {}, CreateRegionInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, townships } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const region = (await service.create({
      name,
      townships: {
        connect: townships.map(townshipId => ({ id: townshipId }))
      }
    })).ok_or_throw()

    // Create event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Region,
      resourceIds: [region.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ region }))
  } catch (err) {
    next(err)
  }
}


export async function deleteRegionHandler(
  req: Request<GetRegionInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const region = (await service.delete(regionId)).ok_or_throw()

    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Region,
      resourceIds: [region.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ region }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultilRegionsHandler(
  req: Request<{}, {}, DeleteMultiRegionsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _deletedRegions = await service.deleteMany({
      filter: {
        id: {
          in: regionIds
        }
      }
    })
    _deletedRegions.ok_or_throw()

    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Region,
      resourceIds: regionIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function updateRegionHandler(
  req: Request<UpdateRegionInput["params"], {}, UpdateRegionInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionId } = req.params
    const data = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const region = (await service.update({
      filter: { id: regionId },
      payload: {
        townships: {
          set: data.townships.map(townshipId => ({ id: townshipId }))
        }
      }
    })).ok_or_throw()

    // Update event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Region,
      resourceIds: [region.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ region }))
  } catch (err) {
    next(err)
  }
}
