import { convertNumericStrings } from "../utils/convertNumber";
import { checkUser } from "../services/checkUser";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateExchangeInput, DeleteMultiExchangesInput, GetExchangeInput, UpdateExchangeInput } from "../schemas/exchange.schema";
import { ExchangeService } from "../services/exchange";
import { OperationAction } from "@prisma/client";

import AppError, { StatusCode } from "../utils/appError";


const service = ExchangeService.new()


export async function getExchangesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, from, to, startDate, endDate, rate } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { shopowner } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const [count, exchanges] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize }
      },
      {
        where: {
          id,
          from,
          to,
          date: {
            lte: endDate,
            gte: startDate
          },
          rate,
        },
        orderBy,
        include: {
          shopowner
        }
      }
    )).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(exchanges, count))
  } catch (err) {
    next(err)
  }
}


export async function getExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { exchangeId } = req.params
    const { shopowner } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const exchange = (await service.tryFindUnique({
      where: { id: exchangeId },
      include: { shopowner }
    })).ok_or_throw()

    // Create event action audit log
    if (exchange && sessionUser) (await service.audit(sessionUser)).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ exchange }))
  } catch (err) {
    next(err)
  }
}


export async function updateExchangeHandler(
  req: Request<UpdateExchangeInput["params"], {}, UpdateExchangeInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params
    const { to, from, rate, date } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update)
    _isAccess.ok_or_throw()

    if (!sessionUser.shopownerProviderId) return next(AppError.new(StatusCode.BadRequest, `Shopowner must be provide`))

    const exchange = (await service.tryUpdate({
      where: {
        id: exchangeId,
        shopownerProviderId: sessionUser.shopownerProviderId
      },
      data: {
        to,
        from,
        rate,
        date,
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ exchange }))
  } catch (err) {
    next(err)
  }
}


export async function createExchangeHandler(
  req: Request<{}, {}, CreateExchangeInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { from, to, rate, date } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    if (!sessionUser.shopownerProvider) return next(AppError.new(StatusCode.BadRequest, `Shopowner must be provide`))

    const exchange = (await service.tryCreate({
      data: {
        from,
        date,
        to,
        rate,
        shopowner: {
          create: {
            name: sessionUser.shopownerProvider.name,
            id: sessionUser.shopownerProvider.id
          }
        }
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ exchange }))
  } catch (err) {
    next(err)
  }
}


export async function createMultiExchangesHandler(
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

    const exchanges = (await service.tryExcelUpload(excelFile)).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpListResponse(exchanges))
  } catch (err) {
    next(err)
  }
}


export async function deleteExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    if (!sessionUser.shopownerProviderId) return next(AppError.new(StatusCode.BadRequest, `Shopowner must be provide`))

    const exchange = (await service.tryDelete({
      where: {
        id: exchangeId,
        shopownerProviderId: sessionUser.shopownerProviderId
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ exchange }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiExchangesHandler(
  req: Request<{}, {}, DeleteMultiExchangesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeIds } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    if (!sessionUser.shopownerProviderId) return next(AppError.new(StatusCode.BadRequest, `Shopowner must be provide`))

    const _tryDeleteExchanges = await service.tryDeleteMany({
      where: {
        id: {
          in: exchangeIds
        },
        shopownerProviderId: sessionUser.shopownerProviderId
      }
    })
    _tryDeleteExchanges.ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}
