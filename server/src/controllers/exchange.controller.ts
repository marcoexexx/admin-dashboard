import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { convertNumericStrings } from "../utils/convertNumber";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateExchangeInput, CreateMultiExchangesInput, DeleteMultiExchangesInput, ExchangeFilterPagination, GetExchangeInput, UpdateExchangeInput } from "../schemas/exchange.schema";
import logging from "../middleware/logging/logging";
import fs from 'fs'
import { parseExcel } from "../utils/parseExcel";


export async function getExchangesHandler(
  req: Request<{}, {}, {}, ExchangeFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy } = convertNumericStrings(req.query)
    const {
      id,
      from,
      to,
      endDate,
      startDate,
      rate
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, exchanges] = await db.$transaction([
      db.exchange.count(),
      db.exchange.findMany({
        where: {
          id,
          from,
          to,
          date: {
            lte: endDate,
            gte: startDate
          },
          rate
        },
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(exchanges, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params

    const exchange = await db.exchange.findUnique({
      where: {
        id: exchangeId
      }
    })

    res.status(200).json(HttpDataResponse({ exchange }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateExchangeHandler(
  req: Request<UpdateExchangeInput["params"], {}, UpdateExchangeInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params
    const data = req.body

    const exchange = await db.exchange.update({
      where: {
        id: exchangeId
      },
      data
    })

    res.status(200).json(HttpDataResponse({ exchange }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createExchangeHandler(
  req: Request<{}, {}, CreateExchangeInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { from, to, rate, date } = req.body
    const exchange = await db.exchange.create({
      data: {
        from,
        date,
        to,
        rate
      },
    })

    res.status(201).json(HttpDataResponse({ exchange }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiExchangesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiExchangesInput

    await db.exchange.createMany({
      data,
      skipDuplicates: true
    })

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params
    await db.exchange.delete({
      where: {
        id: exchangeId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiExchangesHandler(
  req: Request<{}, {}, DeleteMultiExchangesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeIds } = req.body
    await db.exchange.deleteMany({
      where: {
        id: {
          in: exchangeIds
        }
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

