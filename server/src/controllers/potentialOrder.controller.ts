import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { CreatePotentialOrderInput, DeleteMultiPotentialOrdersInput, GetPotentialOrderInput, PotentialOrderFilterPagination, UpdatePotentialOrderInput } from "../schemas/potentialOrder.schema";


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
    const { orderItems, deliveryAddressId, billingAddressId, pickupAddressId, status, paymentMethodProvider, remark } = req.body

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined

    const potentialOrder = await db.potentialOrder.create({
      data: {
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice
          }))
        },
        userId,
        status,
        deliveryAddressId,
        billingAddressId,
        pickupAddressId,
        paymentMethodProvider,
        remark
      }
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
    
    await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          potentialOrderId
        }
      }),

      db.potentialOrder.delete({
        where: {
          id: potentialOrderId
        }
      })
    ])

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
    await db.potentialOrder.deleteMany({
      where: {
        id: {
          in: potentialOrderIds
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
            create: data.orderItems
          },
          userId,
          status: data.status,
          deliveryAddressId: data.deliveryAddressId,
          billingAddressId: data.billingAddressId,
          pickupAddressId: data.pickupAddressId,
          paymentMethodProvider: data.paymentMethodProvider
        }
      })
    ])

    res.status(200).json(HttpDataResponse({ potentialOrder }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
