import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { EventActionType, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { DeleteMultiPickupAddressesInput, GetPickupAddressInput } from "../schemas/pickupAddress.schema";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


export async function getPickupAddressesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, username, phone, email } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { _count, user, orders, potentialOrders } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    // TODO: fix
    const offset = ((page||1) - 1) * (pageSize||10)
    const [count, pickupAddresses] = await db.$transaction([
      db.pickupAddress.count(),
      db.pickupAddress.findMany({
        where: {
          id,
          username,
          phone,
          email,
        },
        include: {
          _count,
          user,
          orders,
          potentialOrders
        },
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
  req: Request<GetPickupAddressInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { pickupAddressId } = req.params
    const { _count, user, orders, potentialOrders } = convertStringToBoolean(query.include) ?? {}

    const pickupAddress = await db.pickupAddress.findUnique({
      where: {
        id: pickupAddressId
      },
      include: {
        _count,
        user,
        orders,
        potentialOrders
      }
    })

    // Read event action audit log
    if (pickupAddress) {
      if (req?.user?.id) createEventAction(db, {
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
    if (req?.user?.id) createEventAction(db, {
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
    if (req?.user?.id) createEventAction(db, {
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
