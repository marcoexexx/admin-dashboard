import AppError, { StatusCode } from "../utils/appError";

import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { CreateBlockUserInput, GetUserByUsernameInput, GetUserInput, RemoveBlockedUserInput, UploadImageUserInput } from "../schemas/user.schema";
import { UserService } from "../services/user";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { checkUser } from "../services/checkUser";
import { OperationAction } from "@prisma/client";


const service = UserService.new()


export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const query = convertNumericStrings(req.query)

    const {
      _count,
      reviews,
      potentialOrders,
      orders,
      reward,
      addresses,
      favorites,
      accessLogs,
      auditLogs,
      createdProducts,
      pickupAddresses,
      cart
    } = convertStringToBoolean(query.include) ?? {}

    const sessionUser = checkUser(req?.user).ok_or_throw()

    const user = (await service.tryFindUnique({
      where: {
        id: sessionUser.id
      },
      include: {
        _count,
        cart,
        reviews,
        potentialOrders,
        orders,
        reward,
        addresses,
        favorites,
        accessLogs,
        auditLogs,
        createdProducts,
        pickupAddresses,
        role: {
          include: {
            permissions: true
          }
        },
        shopownerProvider: true
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function getUserHandler(
  req: Request<GetUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const user = (await service.tryFindUnique({
      where: {
        id: userId
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        shopownerProvider: true
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function getUserByUsernameHandler(
  req: Request<GetUserByUsernameInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const user = (await service.tryFindUnique({
      where: {
        username
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        shopownerProvider: true
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, name, email, username } = query.filter ?? {}
    const { page, pageSize } = query.pagination ?? {}
    const {
      _count,
      reviews,
      potentialOrders,
      orders,
      reward,
      addresses,
      favorites,
      accessLogs,
      auditLogs,
      createdProducts,
      pickupAddresses,
      blockedUsers,
      blockedByUsers,
      cart
    } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    const sessionUser = checkUser(req?.user).ok()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Read)
    _isAccess.ok_or_throw()

    const [count, users] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize }
      },
      {
        where: { id, name, email, username },
        include: {
          _count,
          cart,
          reviews,
          potentialOrders,
          orders,
          reward,
          addresses,
          favorites,
          accessLogs,
          auditLogs,
          createdProducts,
          pickupAddresses,
          blockedUsers,
          blockedByUsers,
          role: {
            include: {
              permissions: true
            }
          },
          shopownerProvider: true
        },
        orderBy
      }
    )).ok_or_throw()

    res.status(StatusCode.OK).json(HttpListResponse(users, count))
  } catch (err) {
    next(err)
  }
}


export async function createBlockUserHandler(
  req: Request<{}, {}, CreateBlockUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { userId, remark } = req.body

  try {
    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update)
    _isAccess.ok_or_throw()

    if (!sessionUser.isSuperuser) return next(AppError.new(StatusCode.Forbidden, `You cannot access this resource.`))

    const user = (await service.tryUpdate({
      where: { id: sessionUser.id },
      data: {
        blockedByUsers: {
          create: {
            userId,
            remark
          }
        }
      }
    }))

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function removeBlockedUserHandler(
  req: Request<RemoveBlockedUserInput["params"]>,
  res: Response,
  next: NextFunction
) {
  const { blockedUserId } = req.params

  try {
    const sessionUser = checkUser(req?.user).ok_or_throw()
    const _isAccess = await service.checkPermissions(sessionUser, OperationAction.Update)
    _isAccess.ok_or_throw()

    if (!sessionUser.isSuperuser) return next(AppError.new(StatusCode.Forbidden, `You cannot access this resource.`))

    const user = (await service.tryUpdate({
      where: { id: sessionUser.id },
      data: {
        blockedByUsers: {
          delete: {
            userId_blockedById: {
              userId: blockedUserId,
              blockedById: sessionUser.id
            }
          }
        }
      }
    }))

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function uploadImageCoverHandler(
  req: Request<{}, {}, UploadImageUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const sessionUser = checkUser(req?.user).ok_or_throw()

    const { image } = req.body

    const user = (await service.tryUpdate({
      where: {
        id: sessionUser.id
      },
      data: {
        coverImage: image
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function uploadImageProfileHandler(
  req: Request<{}, {}, UploadImageUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const sessionUser = checkUser(req?.user).ok_or_throw()

    const { image } = req.body

    const user = (await service.tryUpdate({
      where: {
        id: sessionUser.id
      },
      data: {
        image
      }
    })).ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}
