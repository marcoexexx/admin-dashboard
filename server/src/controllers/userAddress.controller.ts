import { db } from "../utils/db";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { createEventAction } from "../utils/auditLog";
import { convertNumericStrings } from "../utils/convertNumber";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateUserAddressInput, DeleteMultiUserAddressesInput, GetUserAddressInput, UpdateUserAddressInput, UserAddressFilterPagination } from "../schemas/userAddress.schema";
import { EventActionType, Resource } from "@prisma/client";

import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";


export async function getUserAddressesHandler(
  req: Request<{}, {}, {}, UserAddressFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as UserAddressFilterPagination["include"]
    const {
      id,
      username,
      isDefault,
      phone,
      email,
      region,
      township,
      fullAddress,
      remark
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const [count, userAddresses] = await db.$transaction([
      db.userAddress.count(),
      db.userAddress.findMany({
        where: {
          id,
          username,
          userId: user.id,
          isDefault,
          phone,
          email,
          region: { name: region },
          township: { name: township },
          fullAddress,
          remark
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(userAddresses, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUserAddressHandler(
  req: Request<GetUserAddressInput["params"] & Pick<UserAddressFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userAddressId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as UserAddressFilterPagination["include"]

    const userAddress = await db.userAddress.findUnique({
      where: {
        id: userAddressId
      },
      include
    })

    if (userAddress) {
      // Read event action audit log
      if (req.user) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.UserAddress,
        resourceIds: [userAddress.id],
        action: EventActionType.Read
      })
    }

    res.status(200).json(HttpDataResponse({ userAddress }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createUserAddressHandler(
  req: Request<{}, {}, CreateUserAddressInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, isDefault, phone, email,  regionId, townshipFeesId, fullAddress, remark } = req.body

    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const userAddress = await db.userAddress.create({
      data: { 
        isDefault,
        username,
        phone,
        email,
        regionId,
        townshipFeesId,
        userId: user.id,
        fullAddress,
        remark
      },
    })

    // Create event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.UserAddress,
      resourceIds: [userAddress.id],
      action: EventActionType.Create
    })

    res.status(201).json(HttpDataResponse({ userAddress }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "User address already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteUserAddressHandler(
  req: Request<GetUserAddressInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userAddressId } = req.params

    const userAddress = await db.userAddress.delete({
      where: {
        id: userAddressId
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.UserAddress,
      resourceIds: [userAddress.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultiUserAddressesHandler(
  req: Request<{}, {}, DeleteMultiUserAddressesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userAddressIds } = req.body

    await db.userAddress.deleteMany({
      where: {
        id: {
          in: userAddressIds
        }
      }
    })

    // Delete event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.UserAddress,
      resourceIds: userAddressIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateUserAddressHandler(
  req: Request<UpdateUserAddressInput["params"], {}, UpdateUserAddressInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userAddressId } = req.params
    const data = req.body

    const userAddress = await db.userAddress.update({
      where: {
        id: userAddressId,
      },
      data
    })

    // Update event action audit log
    if (req.user) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.UserAddress,
      resourceIds: [userAddress.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ userAddress }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

