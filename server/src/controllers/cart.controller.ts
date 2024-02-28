import { NextFunction, Request, Response } from "express";
import { HttpDataResponse } from "../utils/helper";
import { StatusCode } from "../utils/appError";
import { OperationAction } from "@prisma/client";
import { DeleteCartOrderItemInput, GetCartInput, InitialCartInput } from "../schemas/cart.schema";
import { UserService } from "../services/user";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { generateLabel } from "../utils/generateCouponLabel";
import { generateUuid } from "../utils/generateUuid";


const service = UserService.new()


export async function getCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)
    const { _count, orderItems } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const cart = (await service.tryFindUnique({
      where: { id: sessionUser?.id },
      include: {
        cart: {
          include: {
            _count,
            orderItems
          }
        }
      }
    // @ts-ignore
    })).ok_or_throw()?.cart

    // Create audit log
    if (cart && sessionUser) (await service.audit(sessionUser)).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ cart }))
  } catch (err) {
    next(err)
  }
}


export async function initialCartHandler(
  req: Request<{}, {}, InitialCartInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderItems } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()
    
    console.log(orderItems)

    const cart = (await service.tryInializeCart({
      where: {
        userId: sessionUser.id
      },
      create: {
        label: generateLabel("cart"),
        userId: sessionUser.id,
        orderItems: {
          createMany: {
            data: orderItems.map(item => ({
              ...item,
              originalTotalPrice: item.price * item.quantity
            }))
          }
        }
      },
      update: {
        userId: sessionUser.id,
        orderItems: {
          upsert: orderItems.map(item => ({
            where: {
              id: item.id || generateUuid()
            },
            create: {
              ...item,
              originalTotalPrice: item.price * item.quantity
            },
            update: {
              ...item,
              id: undefined,
              originalTotalPrice: item.price * item.quantity
            },
          }))
        }
      }
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ cart }))
  } catch (err) {
    next(err)
  }
}


export async function deleteCartHandler(
  req: Request<GetCartInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { cartId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const cart = (await service.tryCleanCart({ where: { id: cartId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ cart }))
  } catch (err) {
    next(err)
  }
}


export async function deleteCartOrderItemHandler(
  req: Request<DeleteCartOrderItemInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderItemId } = req.params

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const orderItem = (await service.tryRemoveSingleOrderItem({ where: { id: orderItemId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ orderItem }))
  } catch (err) {
    next(err)
  }
}
