import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { createEventAction } from "../utils/auditLog";
import { EventActionType, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateOrderInput, DeleteMultiOrdersInput, GetOrderInput, OrderFilterPagination, UpdateOrderInput } from "../schemas/order.schema";
import { LifeCycleOrderConcrate, LifeCycleState } from "../utils/auth/life-cycle-state";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


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
      totalPrice,
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
          totalPrice,
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

    // Read event action audit log
    if (order) {
      if (req?.user?.id) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.Order,
        resourceIds: [order.id],
        action: EventActionType.Read
      })
    }

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
    const { orderItems, totalPrice, addressType, deliveryAddressId, billingAddressId, pickupAddressId, status, paymentMethodProvider, remark } = req.body

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined

    const order = await db.order.create({
        data: {
          addressType,
          orderItems: {
            create: await Promise.all(orderItems.map(async item => {
              // update product quantity
              await db.product.update({
                where: {
                  id: item.productId
                },
                data: {
                  quantity: {
                    decrement: item.quantity
                  }
                }
              })

              return {
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                saving: item.saving,
                originalTotalPrice: item.price * item.quantity,
              }
            }))
          },
          userId,
          totalPrice,
          status,
          deliveryAddressId,
          billingAddressId,
          pickupAddressId,
          paymentMethodProvider,
          remark,
        }
    })

    // Create event action audit log
    if (userId) createEventAction(db, {
      userId: userId,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Create
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

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined
    
    const [_deletedOrderItems, _deletedPickupAddress, order] = await db.$transaction([
      db.orderItem.deleteMany({
        where: {
          order: {
            id: orderId,
            userId
          },
        }
      }),

      db.pickupAddress.deleteMany({
        where: {
          orders: {
            some: {
              id: orderId,
              userId
            }
          }
        }
      }),

      db.order.delete({
        where: {
          id: orderId,
          userId
        }
      })
    ])

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Delete
    })

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
          orderId: {
            in: orderIds
          }
        }
      }),

      db.pickupAddress.deleteMany({
        where: {
          orders: {
            some: {
              id: {
                in: orderIds
              }
            }
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

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Order,
      resourceIds: orderIds,
      action: EventActionType.Delete
    })

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

    const originalOrderState = await db.order.findUnique({
      where: {
        id: orderId
      },
      select: {
        status: true
      }
    })

    if (!originalOrderState) return next(new AppError(404, "Order not found"))

    const orderLifeCycleState = new LifeCycleState<LifeCycleOrderConcrate>({ resource: "order", state: originalOrderState.status })
    const orderState = orderLifeCycleState.changeState(data.status)

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
            create: data.orderItems.map(item => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              saving: item.saving,
              originalTotalPrice: item.price * item.quantity
            }))
          },
          totalPrice: data.totalPrice,
          addressType: data.addressType,
          status: orderState,
          deliveryAddressId: data.deliveryAddressId,
          billingAddressId: data.billingAddressId,
          pickupAddressId: data.pickupAddressId,
          paymentMethodProvider: data.paymentMethodProvider,
          remark: data.remark,
        }
      })
    ])

    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ order }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    const status = err?.status || 500

    logging.error(msg)
    next(new AppError(status, msg))
  }
}
