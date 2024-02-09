import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { CreateTownshipInput, DeleteMultiTownshipsInput, GetTownshipInput, UpdateTownshipInput } from "../schemas/township.schema";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper"; 
import { TownshipService } from "../services/township";
import { StatusCode } from "../utils/appError";


const service = TownshipService.new()


export async function getTownshipsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, name, fees } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { _count, userAddresses, region } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const [count, townships] = (await service.tryFindManyWithCount(
      {
        pagination: {page, pageSize}
      },
      {
        where: {id, name, fees},
        include: {_count, userAddresses, region},
        orderBy
      }
    )).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(townships, count))
  } catch (err) {
    next(err)
  }
}


export async function getTownshipHandler(
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { townshipId } = req.params
    const { _count, userAddresses, region } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const township = (await service.tryFindUnique({
      where: {
        id: townshipId
      },
      include: {
        _count,
        userAddresses,
        region
      }
    })).ok_or_throw()

    if (township && sessionUser) {
      const _auditLog = await service.audit(sessionUser)
      _auditLog.ok_or_throw()
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ township }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiTownshipsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(StatusCode.NoContent)

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const townships = (await service.tryExcelUpload(excelFile)).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpListResponse(townships))
  } catch (err) {
    next(err)
  }
}


export async function createTownshipHandler(
  req: Request<{}, {}, CreateTownshipInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, fees } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const township = (await service.tryCreate({
      data: { name, fees },
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ township }))
  } catch (err) {
    next(err)
  }
}


export async function deleteTownshipHandler(
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const township = (await service.tryDelete({
      where: {
        id: townshipId
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ township }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultilTownshipsHandler(
  req: Request<{}, {}, DeleteMultiTownshipsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _deleteTownshipFees = await service.tryDeleteMany({
      where: {
        id: {
          in: townshipIds
        }
      }
    })
    _deleteTownshipFees.ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}


export async function updateTownshipHandler(
  req: Request<UpdateTownshipInput["params"], {}, UpdateTownshipInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipId } = req.params
    const { name, fees } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const township = (await service.tryUpdate({
      where: { id: townshipId },
      data: { name, fees }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ township }))
  } catch (err) {
    next(err)
  }
}
