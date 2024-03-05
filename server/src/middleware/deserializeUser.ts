import redisClient from "../utils/connectRedis";
import AppError, { StatusCode } from "../utils/appError";

import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user";
import { verifyJwt } from "../utils/auth/jwt";
import { tryJSONParse } from "../utils/result/std";


const service = UserService.new()


// TODO: Test
export async function safeDeserializeUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    if (req?.user) return next()

    const authorizationHeader = req.header("authorization");

    let accessToken = 
       authorizationHeader && authorizationHeader.startsWith("Bearer")
        ? authorizationHeader.split(" ")[1]
        : req.cookies.access_token as string;

    if (!accessToken) return next()

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey")  //  decoded.sub == user.id
    if (!decoded) return next()

    const session = await redisClient.get(decoded.sub)

    if (!session) return next()

    const user = (await service.tryFindUnique({
      where: {
        id: tryJSONParse(session).expect(`Failed json parse for session id`).id
      },
      include: {
        shopownerProvider: true,
        cart: true,
        role: {
          include: {
            permissions: true
          }
        }
      }
    })).ok_or_throw()

    // @ts-ignore  for mocha testing
    req.user = user

    next()
  } catch (err) {
    next(err)
  }
}


export async function deserializeUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.header("authorization");

    let accessToken = 
       authorizationHeader && authorizationHeader.startsWith("Bearer")
        ? authorizationHeader.split(" ")[1]
        : req.cookies.access_token as string;

    if (!accessToken) return next(AppError.new(StatusCode.Unauthorized, `You are not logged in`))

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey")  //  decoded.sub == user.id
    if (!decoded) return next(AppError.new(StatusCode.Unauthorized, `Invalid token or user doesn't exist`))

    const session = await redisClient.get(decoded.sub)

    if (!session) return next(AppError.new(StatusCode.Unauthorized, `Invalid token or session has expired`))

    const user = (await service.tryFindUnique({
      where: {
        id: tryJSONParse(session).expect(`Failed json parse for session id`).id
      },
      include: {
        cart: true,
        role: {
          include: {
            permissions: true
          }
        }
      }
    })).ok_or_throw()

    // @ts-ignore  for mocha testing
    req.user = user

    next()
  } catch (err: any) {
    next(err)
  }
}
