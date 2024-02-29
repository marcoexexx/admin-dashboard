import { NextFunction, Request, Response } from "express";
import { HttpDataResponse } from "../utils/helper";
import { StatusCode } from "../utils/appError";
import { OperationAction } from "@prisma/client";
import { CreateCartOrderItemInput, DeleteCartOrderItemInput, GetCartInput, UpdateCartOrderItemInput } from "../schemas/cart.schema";
import { UserService } from "../services/user";
import { OrderItemService } from "../services/orderItem";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { generateLabel } from "../utils/generateCouponLabel";


const userService = UserService.new()
const orderItemService = OrderItemService.new()


export async function getCartHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)
    const { _count, orderItems } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await userService.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const cart = (await userService.tryFindUnique({
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
    if (cart && sessionUser) (await userService.audit(sessionUser)).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ cart }))
  } catch (err) {
    next(err)
  }
}


// On click `Add to cart`
// Just create new cart if does not exist and create a orderItem for a product
export async function createCartOrderItemHandler(
  req: Request<{}, {}, CreateCartOrderItemInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { quantity, productId, price, totalPrice } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await userService.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    // Create or update item if same product in cart
    const upsertItem = async (cartId: string) => {

      return (await orderItemService.tryUpsert({
        where: {
          cartId_productId: {
            cartId,
            productId
          },
        },
        create: {
          productId,
          cartId,
          quantity,
          price,
          totalPrice,
          originalTotalPrice: quantity * price,
          saving: (quantity * price) - totalPrice,
        },
        update: {
          quantity: {
            increment: quantity
          },
          saving: {
            increment: (quantity * price) - totalPrice
          },
          totalPrice: {
            increment: totalPrice
          },
          originalTotalPrice: {
            increment: quantity * price
          }
        }
      })).ok_or_throw()
    }

    // Session user cart
    const cartId = sessionUser.cart?.id

    const orderItem = cartId
      ? await upsertItem(cartId)
      : await upsertItem((await userService.tryUpdate({
        where: {
          id: sessionUser.id
        },
        data: {
          cart: {
            upsert: {
              where: {
                id: cartId
              },
              create: {
                label: generateLabel("cart"),
              },
              update: {}  // Not update cart
            }
          }
        }
      })).ok_or_throw().id)

    // Create audit log
    const _auditLog = await orderItemService.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ orderItem }))
  } catch (err) {
    next(err)
  }
}


export async function updateCartOrderItemHandler(
  req: Request<UpdateCartOrderItemInput["params"], {}, UpdateCartOrderItemInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderItemId } = req.params
    const { quantity, price, totalPrice } = req.body

    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await userService.checkPermissions(sessionUser, OperationAction.Create)
    _isAccess.ok_or_throw()

    const orderItem = (await orderItemService.tryUpdate({
      where: {
        id: orderItemId,
      },
      data: {
        quantity,
        price,
        totalPrice,
        originalTotalPrice: quantity * price,
        saving: (quantity * price) - totalPrice,
      }
    }))

    // Create audit log
    const _auditLog = await userService.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ orderItem }))
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
    const _isAccess = await userService.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const cart = (await userService.tryCleanCart({ where: { id: cartId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await userService.audit(sessionUser)
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
    const _isAccess = await userService.checkPermissions(sessionUser, OperationAction.Delete)
    _isAccess.ok_or_throw()

    const orderItem = (await userService.tryRemoveSingleOrderItem({ where: { id: orderItemId } })).ok_or_throw()

    // Create audit log
    const _auditLog = await userService.audit(sessionUser)
    _auditLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ orderItem }))
  } catch (err) {
    next(err)
  }
}
