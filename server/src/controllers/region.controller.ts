import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { CreateRegionInput, DeleteMultiRegionsInput, GetRegionInput, UpdateRegionInput } from "../schemas/region.schema";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { RegionService } from "../services/region";
import { StatusCode } from "../utils/appError";
import { OperationAction } from "@prisma/client";


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

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const [count, regions] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize }
      },
      {
        where: { id, name },
        include: { _count, townships, userAddresses },
        orderBy
      }
    )).ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const region = (await service.tryFindUnique({ where: { id: regionId }, include: { _count, townships, userAddresses } })).ok_or_throw()

    if (region && sessionUser) {
      const _auditLog = await service.audit(sessionUser)
      _auditLog.ok_or_throw()
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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const regions = (await service.tryExcelUpload(excelFile)).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const region = (await service.tryCreate({
      data: {
        name,
        townships: {
          connect: townships.map(townshipId => ({ id: townshipId }))
        }
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const region = (await service.tryDelete({ where: { id: regionId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const _deletedRegions = await service.tryDeleteMany({
      where: {
        id: {
          in: regionIds
        }
      }
    })
    _deletedRegions.ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

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
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update)
    _isAccess.ok_or_throw()

    const region = (await service.tryUpdate({
      where: { id: regionId },
      data: {
        townships: {
          set: data.townships.map(townshipId => ({ id: townshipId }))
        }
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ region }))
  } catch (err) {
    next(err)
  }
}
