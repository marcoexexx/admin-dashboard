import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { convertNumericStrings } from "../utils/convertNumber";
import { UserFilterPagination } from "../schemas/user.schema";
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
    const { id, name, email } = filter ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { id: undefined, name: undefined, price: undefined, count: undefined }
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
