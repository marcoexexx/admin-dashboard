import logging from "../middleware/logging/logging";
import fs from "fs"
import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper"; import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; import { CityFilterPagination, CreateCityInput, CreateMultiCitisInput, DeleteMultiCitisInput, GetCityInput, UpdateCityInput } from "../schemas/city.schema";
import AppError from "../utils/appError";


export async function getCitiesHandler(
  req: Request<{}, {}, {}, CityFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as CityFilterPagination["include"]
    const {
      id,
      city,
      fees,
    } = filter
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, cities] = await db.$transaction([
      db.cityFees.count(),
      db.cityFees.findMany({
        where: {
          id,
          city,
          fees,
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(cities, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getCityHandler(
  req: Request<GetCityInput["params"] & Pick<CityFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { cityId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as CityFilterPagination["include"]

    const city = await db.cityFees.findUnique({
      where: {
        id: cityId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ city }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createMultiCitiesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiCitisInput

    // Update not affected
    await Promise.all(data.map(city => db.cityFees.upsert({
      where: {
        city: city.city
      },
      create: {
        city: city.city,
        fees: city.fees,
      },
      update: {}
    })))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "City already exists"))

    next(new AppError(500, msg))
  }
}


export async function createCityHandler(
  req: Request<{}, {}, CreateCityInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { city: cityName, fees } = req.body

    const city = await db.cityFees.create({
      data: { city: cityName, fees },
    })

    res.status(201).json(HttpDataResponse({ city }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "City already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteCityHandler(
  req: Request<GetCityInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { cityId } = req.params

    await db.cityFees.delete({
      where: {
        id: cityId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultilCitiesHandler(
  req: Request<{}, {}, DeleteMultiCitisInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { cityIds } = req.body

    await db.cityFees.deleteMany({
      where: {
        id: {
          in: cityIds
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


export async function updateCityHandler(
  req: Request<UpdateCityInput["params"], {}, UpdateCityInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { cityId } = req.params
    const data = req.body

    const [city] = await db.$transaction([
      db.cityFees.update({
        where: {
          id: cityId,
        },
        data: {
          city: data.city,
          fees: data.fees
        }
      })
    ])

    res.status(200).json(HttpDataResponse({ city }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
