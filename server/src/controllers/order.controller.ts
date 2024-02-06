import AppError, { StatusCode } from "../utils/appError";

import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { convertNumericStrings } from "../utils/convertNumber";
import { createEventAction } from "../utils/auditLog";
import { checkUser } from "../services/checkUser";
import { EventActionType, Resource } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { CreateOrderInput, DeleteMultiOrdersInput, GetOrderInput, UpdateOrderInput } from "../schemas/order.schema";
import { LifeCycleOrderConcrate, LifeCycleState } from "../utils/auth/life-cycle-state";
import { OrderService } from "../services/order";


const service = OrderService.new()


export async function getOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, startDate, endDate, status, totalPrice, remark } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const { _count, user, orderItems, pickupAddress, billingAddress, deliveryAddress } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const [count, orders] = (await service.find({
      filter: {
        id,
        updatedAt: {
          gte: startDate,
          lte: endDate
        },
        status,
        totalPrice,
        remark,
      },
      pagination: {
        page,
        pageSize
      },
      include: {
        _count,
        user,
        orderItems,
        pickupAddress,
        billingAddress,
        deliveryAddress
      },
      orderBy
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(orders, count))
  } catch (err) {
    next(err)
  }
}


export async function getOrderHandler(
  req: Request<GetOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { orderId } = req.params
    const { _count, user, orderItems, pickupAddress, billingAddress, deliveryAddress } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const order = (await service.findUnique(orderId, { _count, user, orderItems, pickupAddress, billingAddress, deliveryAddress })).ok_or_throw()

    // Read event action audit log
    if (order) {
      if (sessionUser?.id) createEventAction(db, {
        userId: sessionUser.id,
        resource: Resource.Order,
        resourceIds: [order.id],
        action: EventActionType.Read
      })
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ order }))
  } catch (err) {
    next(err)
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
    const sessionUser = checkUser(req?.user).ok()
    const userId = sessionUser?.id

    const order = (await service.create({
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
    })).ok_or_throw()

    // Create event action audit log
    if (userId) createEventAction(db, {
      userId: userId,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Create
    })

    res.status(StatusCode.Created).json(HttpDataResponse({ order }))
  } catch (err) {
    next(err)
  }
}


export async function deleteOrderHandler(
  req: Request<GetOrderInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params

    const sessionUser = checkUser(req.user).ok_or_throw()
    const order = (await service.delete(orderId, { sessionUser })).ok_or_throw()
    
    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ order }))
  } catch (err) {
    next(err)
  }
}


export async function deleteMultiOrdersHandler(
  req: Request<{}, {}, DeleteMultiOrdersInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderIds } = req.body

    // @ts-ignore  for mocha testing
    const sessionUser = checkUser(req.user).ok_or_throw()
    const _deletedOrders = await service.deleteMany(orderIds, { sessionUser })
    _deletedOrders.ok_or_throw()

    // Delete event action audit log
    createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Order,
      resourceIds: orderIds,
      action: EventActionType.Delete
    })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success deleted"))
  } catch (err) {
    next(err)
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

    const originalOrderState = (await service.findUnique(orderId, undefined, { status: true })).ok_or_throw()

    if (!originalOrderState) return next(AppError.new(StatusCode.NotFound, `Order not found`))

    const orderLifeCycleState = new LifeCycleState<LifeCycleOrderConcrate>({ resource: "order", state: originalOrderState.status })
    const orderState = orderLifeCycleState.changeState(data.status)

    // @ts-ignore  for mocha testing
    const sessionUser = checkUser(req.user).ok_or_throw()
    const order = (await service.update({
      filter: {
        id: orderId
      },
      payload: {
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
      },
    })).ok_or_throw()

    // Update event action audit log
    if (sessionUser?.id) createEventAction(db, {
      userId: sessionUser.id,
      resource: Resource.Order,
      resourceIds: [order.id],
      action: EventActionType.Update
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ order }))
  } catch (err: any) {
    next(err)
  }
}
