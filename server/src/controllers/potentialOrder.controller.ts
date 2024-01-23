import { createEventAction } from "../utils/auditLog";
import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreatePotentialOrderInput, DeleteMultiPotentialOrdersInput, GetPotentialOrderInput, PotentialOrderFilterPagination, UpdatePotentialOrderInput } from "../schemas/potentialOrder.schema";
import { EventActionType, Resource } from "@prisma/client";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


export async function getPotentialOrdersHandler(
  req: Request<{}, {}, {}, PotentialOrderFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as PotentialOrderFilterPagination["include"]
    const {
      id,
      status,
      startDate,
      remark,
      totalPrice,
      endDate
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, potentialOrders] = await db.$transaction([
      db.potentialOrder.count(),
      db.potentialOrder.findMany({
        where: {
          id,
          updatedAt: {
            gte: startDate,
            lte: endDate
          },
          status,
          totalPrice,
          remark,
        },
        orderBy,
        skip: offset,
        take: pageSize,
        include
      })
    ])

    res.status(200).json(HttpListResponse(potentialOrders, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getPotentialOrderHandler(
  req: Request<GetPotentialOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { potentialOrderId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as PotentialOrderFilterPagination["include"]

    const potentialOrder = await db.potentialOrder.findUnique({
      where: {
        id: potentialOrderId
      },
      include
    })

    // Read event action audit log
    if (potentialOrder) {
      createEventAction(db, {
        userId: req.user?.id,
        resource: Resource.PotentialOrder,
        resourceIds: [potentialOrder.id],
        action: EventActionType.Read
      })
    }

    res.status(200).json(HttpDataResponse({ potentialOrder }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createPotentialOrderHandler(
  req: Request<{}, {}, CreatePotentialOrderInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, orderItems, totalPrice, addressType, deliveryAddressId, billingAddressId, pickupAddress, status, paymentMethodProvider, remark } = req.body

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined

    const newPickupAddress = pickupAddress ? await db.pickupAddress.create({
      data: pickupAddress
    }) : undefined

    const potentialOrder = await db.potentialOrder.upsert({
      where: {
        id
      },
      create: {
        addressType,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            saving: item.saving,
            originalTotalPrice: item.price * item.quantity,
          }))
        },
        userId,
        status,
        totalPrice,
        deliveryAddressId,
        billingAddressId,
        pickupAddressId: newPickupAddress?.id,
        paymentMethodProvider,
      },
      update: {
        addressType,
        // WARN: order items not affected
        userId,
        status,
        totalPrice,
        deliveryAddressId,
        billingAddressId,
        pickupAddressId: newPickupAddress?.id,
        paymentMethodProvider,
        remark
      }
    })

    // Create event action audit log
    createEventAction(db, {
      userId: req.user?.id,
      resource: Resource.PotentialOrder,
      resourceIds: [potentialOrder.id],
      action: EventActionType.Create
    })

    res.status(201).json(HttpDataResponse({ potentialOrder }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "potentialOrder already exists"))

    next(new AppError(500, msg))
  }
}


export async function deletePotentialOrderHandler(
  req: Request<GetPotentialOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { potentialOrderId } = req.params
    
    const [_deletedOrderItems, potentialOrder] = await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          orderId: undefined,
          potentialOrderId,
        }
      }),

      db.potentialOrder.delete({
        where: {
          id: potentialOrderId
        }
      })
    ])

    // Delete event action audit log
    createEventAction(db, {
      userId: req.user?.id,
      resource: Resource.PotentialOrder,
      resourceIds: [potentialOrder.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiPotentialOrdersHandler(
  req: Request<{}, {}, DeleteMultiPotentialOrdersInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { potentialOrderIds } = req.body

    await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          orderId: undefined,
          potentialOrderId: {
            in: potentialOrderIds
          }
        }
      }),

      db.potentialOrder.deleteMany({
        where: {
          id: {
            in: potentialOrderIds
          }
        }
      })
    ])

    // Delete event action audit log
    createEventAction(db, {
      userId: req.user?.id,
      resource: Resource.PotentialOrder,
      resourceIds: potentialOrderIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}



export async function updatePotentialOrderHandler(
  req: Request<UpdatePotentialOrderInput["params"], {}, UpdatePotentialOrderInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { potentialOrderId } = req.params
    const data = req.body

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined

    const [_, potentialOrder] = await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          potentialOrderId
        }
      }),
      db.potentialOrder.update({
        where: {
          id: potentialOrderId,
        },
        data: {
          orderItems: {
            create: data.orderItems.map(item => ({
              ...item,
              originalTotalPrice: item.price * item.quantity
            }))
          },
          totalPrice: data.totalPrice,
          userId,
          addressType: data.addressType,
          status: data.status,
          deliveryAddressId: data.deliveryAddressId,
          billingAddressId: data.billingAddressId,
          paymentMethodProvider: data.paymentMethodProvider,
          remark: data.remark
        }
      })
    ])

    // Update event action audit log
    createEventAction(db, {
      userId: req.user?.id,
      resource: Resource.PotentialOrder,
      resourceIds: [potentialOrder.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ potentialOrder }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
