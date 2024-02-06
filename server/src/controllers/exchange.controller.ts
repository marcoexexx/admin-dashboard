import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateExchangeInput, DeleteMultiExchangesInput, GetExchangeInput, UpdateExchangeInput } from "../schemas/exchange.schema";
import { EventActionType, Resource } from "@prisma/client";
import { ExchangeService } from "../services/exchange";
import { StatusCode } from "../utils/appError";


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
    const orderBy = query.orderBy ?? {}

    const [count, exchanges] = (await service.find({
      filter: {
        id,
        from,
        to,
        date: {
          lte: endDate,
          gte: startDate
        },
        rate
      },
      pagination: {
        page,
        pageSize
      },
      orderBy
    })).ok_or_throw()

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
    const { exchangeId } = req.params

    const sessionUser = checkUser(req?.user).ok()
    const exchange = (await service.findUnique(exchangeId)).ok_or_throw()

    // Read event action audit log
    if (exchange) {
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser?.id,
        resource: Resource.Exchange,
        resourceIds: [exchange.id],
        action: EventActionType.Read
      })
    }

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
    const exchange = (await service.update({
      filter: {
        id: exchangeId
      },
      payload: {
        to,
        from,
        rate,
        date,
      }
    })).ok_or_throw()

    // Update event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Exchange,
      resourceIds: [exchange.id],
      action: EventActionType.Update
    })

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
    const exchange = (await service.create({
      from,
      date,
      to,
      rate
    })).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Exchange,
      resourceIds: [exchange.id],
      action: EventActionType.Create
    })

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
    const exchanges = (await service.excelUpload(excelFile)).ok_or_throw()

    // Create event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Exchange,
      resourceIds: exchanges.map(exchange => exchange.id),
      action: EventActionType.Create
    })

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
    const exchange = await db.exchange.delete({
      where: {
        id: exchangeId
      }
    })

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Exchange,
      resourceIds: [exchange.id],
      action: EventActionType.Delete
    })

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
    const _tryDeleteExchanges = await service.deleteMany({
      filter: {
        id: {
          in: exchangeIds
        }
      }
    })
    _tryDeleteExchanges.ok_or_throw()

    // Delete event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Exchange,
      resourceIds: exchangeIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
  }
}
