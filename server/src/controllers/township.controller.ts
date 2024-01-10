import logging from "../middleware/logging/logging";
import fs from "fs"
import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper"; 
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; 
import { CreateMultiTownshipsInput, CreateTownshipInput, DeleteMultiTownshipsInput, GetTownshipInput, TownshipFilterPagination, UpdateTownshipInput } from "../schemas/township.schema";
import AppError from "../utils/appError";


export async function getTownshipsHandler(
  req: Request<{}, {}, {}, TownshipFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as TownshipFilterPagination["include"]
    const {
      id,
      name,
      fees,
    } = filter
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, townships] = await db.$transaction([
      db.townshipFees.count(),
      db.townshipFees.findMany({
        where: {
          id,
          name,
          fees,
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(townships, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getTownshipHandler(
  req: Request<GetTownshipInput["params"] & Pick<TownshipFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as TownshipFilterPagination["include"]

    const township = await db.townshipFees.findUnique({
      where: {
        id: townshipId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ township }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createMultiTownshipsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiTownshipsInput

    // Update not affected
    await Promise.all(data.map(township => db.townshipFees.upsert({
      where: {
        name: township.name
      },
      create: {
        name: township.name,
        fees: township.fees,
      },
      update: {}
    })))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Township already exists"))

    next(new AppError(500, msg))
  }
}


export async function createTownshipHandler(
  req: Request<{}, {}, CreateTownshipInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, fees } = req.body

    const township = await db.townshipFees.create({
      data: { name, fees },
    })

    res.status(201).json(HttpDataResponse({ township }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Township already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteTownshipHandler(
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipId } = req.params

    await db.townshipFees.delete({
      where: {
        id: townshipId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultilTownshipsHandler(
  req: Request<{}, {}, DeleteMultiTownshipsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipIds } = req.body

    await db.townshipFees.deleteMany({
      where: {
        id: {
          in: townshipIds
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


export async function updateTownshipHandler(
  req: Request<UpdateTownshipInput["params"], {}, UpdateTownshipInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { townshipId } = req.params
    const data = req.body

    const [townships] = await db.$transaction([
      db.townshipFees.update({
        where: {
          id: townshipId,
        },
        data: {
          name: data.name,
          fees: data.fees
        }
      })
    ])

    res.status(200).json(HttpDataResponse({ townships }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
