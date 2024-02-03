import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper"; 
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; 
import { CreateMultiTownshipsInput, CreateTownshipInput, DeleteMultiTownshipsInput, GetTownshipInput, UpdateTownshipInput } from "../schemas/township.schema";
import { EventActionType, Resource } from "@prisma/client";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";
import fs from "fs"


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

    // TODO: fix
    const offset = ((page||1) - 1) * (pageSize||10)

    const [count, townships] = await db.$transaction([
      db.townshipFees.count(),
      db.townshipFees.findMany({
        where: {
          id,
          name,
          fees,
        },
        include: {
          _count,
          userAddresses,
          region
        },
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
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { townshipId } = req.params
    const { _count, userAddresses, region } = convertStringToBoolean(query.include) ?? {}

    const township = await db.townshipFees.findUnique({
      where: {
        id: townshipId
      },
      include: {
        _count,
        userAddresses,
        region
      }
    })

    if (township) {
      // Read event action audit log
      if (req?.user?.id) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.Township,
        resourceIds: [township.id],
        action: EventActionType.Read
      })
    }

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
    const townships = await Promise.all(data.map(township => db.townshipFees.upsert({
      where: {
        name: township.name
      },
      create: {
        name: township.name,
        fees: township.fees,
      },
      update: {}
    })))

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Township,
      resourceIds: townships.map(township => township.id),
      action: EventActionType.Create
    })

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

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Township,
      resourceIds: [township.id],
      action: EventActionType.Create
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

    const township = await db.townshipFees.delete({
      where: {
        id: townshipId
      }
    })

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Township,
      resourceIds: [township.id],
      action: EventActionType.Delete
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

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Township,
      resourceIds: townshipIds,
      action: EventActionType.Delete
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

    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Township,
      resourceIds: [townships.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ townships }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
