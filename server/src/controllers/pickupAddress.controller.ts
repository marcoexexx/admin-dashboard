import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { EventActionType, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { DeleteMultiPickupAddressesInput, GetPickupAddressInput, PickupAddressFilterPagination } from "../schemas/pickupAddress.schema";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


export async function getPickupAddressesHandler(
  req: Request<{}, {}, {}, PickupAddressFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as PickupAddressFilterPagination["include"]
    const {
      id,
      username,
      phone,
      email,
      // TODO: date filter
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, pickupAddresses] = await db.$transaction([
      db.pickupAddress.count(),
      db.pickupAddress.findMany({
        where: {
          id,
          username,
          phone,
          email,
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(pickupAddresses, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getPickupAddressHandler(
  req: Request<GetPickupAddressInput["params"] & Pick<PickupAddressFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { pickupAddressId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as PickupAddressFilterPagination["include"]

    const pickupAddress = await db.pickupAddress.findUnique({
      where: {
        id: pickupAddressId
      },
      include
    })

    // Read event action audit log
    if (pickupAddress) {
      if (req.user) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.PickupAddress,
        resourceIds: [pickupAddress.id],
        action: EventActionType.Read
      })
    }

    res.status(200).json(HttpDataResponse({ pickupAddress }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deletePickupAddressHandler(
  req: Request<GetPickupAddressInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { pickupAddressId } = req.params

    const pickupAddress = await db.pickupAddress.delete({
      where: {
        id: pickupAddressId
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.PickupAddress,
      resourceIds: [pickupAddress.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiPickupAddressesHandler(
  req: Request<{}, {}, DeleteMultiPickupAddressesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { pickupAddressIds } = req.body

    await db.pickupAddress.deleteMany({
      where: {
        id: {
          in: pickupAddressIds
        }
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.PickupAddress,
      resourceIds: pickupAddressIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
