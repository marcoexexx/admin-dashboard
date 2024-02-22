import { NextFunction, Request, Response } from "express";
import { HttpDataResponse } from "../utils/helper";
import { StatusCode } from "../utils/appError";
import { OperationAction } from "@prisma/client";
import { CartService } from "../services/cart";
import { GetCartInput, InitialCartInput } from "../schemas/cart.schema";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { generateCouponLabel } from "../utils/generateCouponLabel";


const service = CartService.new()


export async function getCartHandler(
  req: Request<GetCartInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { cartId } = req.params
    const { _count, orderItems } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const cart = (await service.tryFindUnique({
      where: { id: cartId },
      include: {
        _count,
        orderItems
      }
    })).ok_or_throw()

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
    const { orderItems, label } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const deletedCart = (await service.tryDelete({
      where: { label }
    })).ok()

    const cart = (await service.tryCreate({
      data: {
        label: generateCouponLabel(12),
        userId: sessionUser.id,
        orderItems: {
          createMany: {
            data: orderItems.map(item => ({
              ...item,
              originalTotalPrice: item.price * item.quantity,
            }))
          }
        }
      },
    })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ cart, deletedCart }))
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

    const cart = (await service.tryDelete({ where: { id: cartId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await service.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ cart }))
  } catch (err) {
    next(err)
  }
}
