import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { convertNumericStrings } from "../utils/convertNumber";
import { ChangeUserRoleInput, GetUserInput, UploadImageUserInput, UserFilterPagination } from "../schemas/user.schema";
import { db } from "../utils/db";

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUsersHandler(
  // TODO: pagination & filter  with relationship
  req: Request<{}, {}, {}, UserFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter, pagination } = convertNumericStrings(req.query)
    const { id, name, email } = filter
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const users = await db.user.findMany({
      where: {
        id,
        name,
        email,
      },
      skip: offset,
      take: pageSize
    })
    res.status(200).json(HttpListResponse(users))
  } catch (err) {
    next(err)
  }
}


// must use after, onlyAdmin middleware
export async function changeUserRoleHandler(
  req: Request<GetUserInput, {}, ChangeUserRoleInput>,
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
