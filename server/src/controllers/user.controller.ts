import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { ChangeUserRoleInput, CreateBlockUserInput, GetUserByUsernameInput, GetUserInput, RemoveBlockedUserInput, UploadImageUserInput } from "../schemas/user.schema";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { db } from "../utils/db";

import logging from "../middleware/logging/logging";
import AppError, { StatusCode } from "../utils/appError";
import { checkUser } from "../services/checkUser";
import { Role } from "@prisma/client";


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
      eventActions,
      createdProducts,
      pickupAddresses
    } = convertStringToBoolean(query.include) ?? {}

    const session_user = req.user
    if (!session_user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const user = await db.user.findUnique({
      where: {
        id: session_user.id
      },
      include: {
        _count,
        reviews,
        potentialOrders,
        orders,
        reward,
        addresses,
        favorites,
        accessLogs,
        eventActions,
        createdProducts,
        pickupAddresses
      }
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUserHandler(
  req: Request<GetUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUserByUsernameHandler(
  req: Request<GetUserByUsernameInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params

    const user = await db.user.findUnique({
      where: {
        username
      }
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = convertNumericStrings(req.query)

    const { id, name, email } = query.filter ?? {}
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
      eventActions,
      createdProducts,
      pickupAddresses,
      blockedUsers,
      blockedByUsers,
    } = convertStringToBoolean(query.include) ?? {}
    const orderBy = query.orderBy ?? {}

    // TODO: fix
    const offset = ((page||1) - 1) * (pageSize||10)

    const users = await db.user.findMany({
      where: {
        id,
        name,
        email,
      },
      skip: offset,
      take: pageSize,
      orderBy,
      include: {
        _count,
        reviews,
        potentialOrders,
        orders,
        reward,
        addresses,
        favorites,
        accessLogs,
        eventActions,
        createdProducts,
        pickupAddresses,
        blockedUsers,
        blockedByUsers
      }
    })
    res.status(200).json(HttpListResponse(users))
  } catch (err) {
    next(err)
  }
}


// must use after, onlyAdmin middleware
export async function changeUserRoleHandler(
  req: Request<ChangeUserRoleInput["params"], {}, ChangeUserRoleInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params
  const { role } = req.body

  try {
    const userExist = await db.user.findUnique({ where: {
      id: userId
    }});

    if (!userExist) return next(new AppError(404, "User not found"))

    const updatedUser = await db.user.update({ 
      where: {
        id: userExist.id
      },
      data: {
        role
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
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
    if (sessionUser.role !== Role.Admin) return next(AppError.new(StatusCode.Forbidden, `You cannot access this resource.`))

    const updatedUser = await db.blockedUser.create({
      data: {
        userId,
        blockedById: sessionUser.id,
        remark
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
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
    if (sessionUser.role !== Role.Admin) return next(AppError.new(StatusCode.Forbidden, `You cannot access this resource.`))

    const updatedUser = await db.blockedUser.delete({ 
      where: {
        id: blockedUserId,
      },
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
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
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const { image } = req.body

    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        coverImage: image
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
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
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const { image } = req.body

    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        image
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
  } catch (err) {
    next(err)
  }
}
