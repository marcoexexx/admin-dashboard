import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { CreateOrderInput, DeleteMultiOrdersInput, GetOrderInput, OrderFilterPagination, UpdateOrderInput } from "../schemas/order.schema";


export async function getOrdersHandler(
  req: Request<{}, {}, {}, OrderFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as OrderFilterPagination["include"]
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

    const [count, orders] = await db.$transaction([
      db.order.count(),
      db.order.findMany({
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

    res.status(200).json(HttpListResponse(orders, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getOrderHandler(
  req: Request<GetOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as OrderFilterPagination["include"]

    const order = await db.order.findUnique({
      where: {
        id: orderId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ order }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createOrderHandler(
  req: Request<{}, {}, CreateOrderInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderItems, addressType, deliveryAddressId, billingAddressId, pickupAddressId, status, paymentMethodProvider, remark } = req.body

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined

    const order = await db.order.create({
      data: {
        addressType,
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
        remark,
      },
    })

    res.status(201).json(HttpDataResponse({ order }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "order already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteOrderHandler(
  req: Request<GetOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params
    
    await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          // TODO: Must test
          orderId
        }
      }),

      db.order.delete({
        where: {
          id: orderId
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


export async function deleteMultiOrdersHandler(
  req: Request<{}, {}, DeleteMultiOrdersInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderIds } = req.body

    await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          // TODO: Must test
          orderId: {
            in: orderIds
          }
        }
      }),

      db.order.deleteMany({
        where: {
          id: {
            in: orderIds
          }
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



export async function updateOrderHandler(
  req: Request<UpdateOrderInput["params"], {}, UpdateOrderInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params
    const data = req.body

    const [_, order] = await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          orderId
        }
      }),
      db.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderItems: {
            create: data.orderItems
          },
          addressType: data.addressType,
          status: data.status,
          deliveryAddressId: data.deliveryAddressId,
          billingAddressId: data.billingAddressId,
          pickupAddressId: data.pickupAddressId,
          paymentMethodProvider: data.paymentMethodProvider,
          remark: data.remark,
        }
      })
    ])

    res.status(200).json(HttpDataResponse({ order }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
