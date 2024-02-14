import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import redisClient from "../utils/connectRedis";
import getConfig from "../utils/getConfig";
import logging from "../middleware/logging/logging";
import AppError, { StatusCode } from "../utils/appError";

import { CookieOptions, NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput, Role, VerificationEmailInput } from "../schemas/user.schema";
import { HttpDataResponse, HttpResponse } from "../utils/helper";
import { UserService } from '../services/user';
import { AccessLogService } from '../services/accessLog';
import { signToken, verifyJwt } from "../utils/auth/jwt";
import { generateRandomUsername } from "../utils/generateRandomUsername";
import { db } from "../utils/db";
import { getGoogleAuthToken, getGoogleUser } from '../services/OAuth';


const service = UserService.new()
const accessLogService = AccessLogService.new()


const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax"
}

if (getConfig("nodeEnv") === "production") cookieOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + getConfig("accessTokenExpiresIn") * 1000),
  maxAge: getConfig("accessTokenExpiresIn") * 1000
}

const refreshTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + getConfig("refreshTokenExpiresIn") * 1000),
  maxAge: getConfig("refreshTokenExpiresIn") * 1000
}


export async function registerUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    const user = (await service.register({ name, email, password })).ok_or_throw()

    res.status(StatusCode.Created).json(HttpDataResponse({ user }))
  } catch (err) {
    next(err)
  }
}


export async function verificationEmailHandler(
  req: Request<VerificationEmailInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.verificationCode)
      .digest("hex")

    const user = (await service.tryFindFirst({ where: { verificationCode } })).ok_or_throw()

    if (!user) return next(AppError.new(StatusCode.Unauthorized, `Could not verify email`))

    const _updatedUser = await service.tryUpdate({
      where: { id: user.id },
      data: { verified: true, verificationCode: null }
    })
    _updatedUser.ok_or_throw()

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, `Email verified successfully`))
  } catch (err) {
    next(err)
  }
}


export async function googleOAuthHandler(
  req: Request<{}, {}, {}, {
    code: string,
    state: string
  }>,
  res: Response,
  next: NextFunction
) {
  try {
    const code = req.query.code
    const pathUrl = req.query.state || "/"

    let role: Role = "User"

    if (!code) return next(AppError.new(StatusCode.Unauthorized, "Authorization code not provided!"))

    const { id_token, access_token } = (await getGoogleAuthToken(code)).ok_or_throw()

    const { name, verified_email, email, picture } = (await getGoogleUser({ id_token, access_token })).ok_or_throw()

    if (!verified_email) return next(AppError.new(StatusCode.Forbidden, "Google account not verified"))

    // set Admin if first time create user,
    const usersExist = await db.user.count();

    if (usersExist === 0) {
      role = "Admin"
    }

    const user = await db.user.upsert({
      where: { email },
      create: {
        createdAt: new Date(),
        reward: {
          create: {
            points: 0,
          }
        },
        name,
        username: generateRandomUsername(12),
        email,
        image: picture,
        password: "",
        verified: true,
        role,
        provider: "Google"
      },
      update: {
        name,
        email,
        image: picture,
        provider: "Google"
      }
    })

    if (!user) return res.redirect(`${getConfig("origin")}/oauth/error`)

    const { accessToken, refreshToken } = await signToken(user)
    res.cookie("access_token", accessToken, accessTokenCookieOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    res.redirect(`${getConfig("origin")}${pathUrl}`)
  } catch (err: any) {
    const msg = err?.message
    next(AppError.new(err.status || StatusCode.InternalServerError, msg))
  }
}


export async function loginUserHandler(
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    if (!user) return next(AppError.new(StatusCode.BadRequest, "invalid email or password"))

    // Check verified
    if (!user.verified) return next(AppError.new(StatusCode.BadRequest, 'You are not verified'))

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return next(AppError.new(StatusCode.BadRequest, "invalid email or password"))

    const { accessToken, refreshToken } = await signToken(user)
    res.cookie("access_token", accessToken, accessTokenCookieOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    const platform = req.useragent.platform
    const browser = `${req.useragent.browser}/${req.useragent.version}`

    // create access log
    const _accessLog = await accessLogService.tryCreate({
      data: {
        userId: user.id,
        ip: req.ip || "unknown ip",
        browser,
        platform,
      }
    })
    _accessLog.ok_or_throw()

    res.status(StatusCode.OK).json(HttpDataResponse({ accessToken }))
  } catch (err: any) {
    const msg = err?.message
    next(AppError.new(err.status || StatusCode.InternalServerError, msg))
  }
}


export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refresh_token;
    const message = "Could not refresh access token";

    if (!refreshToken) {
      logging.error("Failed refresh:", message, refreshToken)
      res.cookie("logged_in", "", { maxAge: 1 })
      return next(AppError.new(StatusCode.Forbidden, message))
    }

    const decoded = verifyJwt(refreshToken, "refreshTokenPublicKey")  //  decoded.sub == user.id
    if (!decoded) {
      res.cookie("logged_in", "", { maxAge: 1 })
      return next(AppError.new(StatusCode.Forbidden, message))
    }

    const session = await redisClient.get(decoded.sub)
    if (!session) {
      res.cookie("logged_in", "", { maxAge: 1 })
      return next(AppError.new(StatusCode.Forbidden, message))
    }

    const user = await db.user.findUnique({
      where: {
        id: JSON.parse(session).id
      }
    })
    if (!user) return next(AppError.new(StatusCode.Forbidden, message))

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await signToken(user)
    res.cookie("access_token", newAccessToken, accessTokenCookieOptions)
    res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions)
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    res.status(StatusCode.OK).json(HttpDataResponse({ accessToken: newAccessToken }))
  } catch (err: any) {
    const msg = err.message
    next(AppError.new(err.status || StatusCode.InternalServerError, msg))
  }
}


export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(AppError.new(StatusCode.Forbidden, "Session has expired or user doesn't exist"))

    await redisClient.del(user.id)

    res.cookie("access_token", "", { maxAge: 1 })
    res.cookie("refresh_token", "", { maxAge: 1 })
    res.cookie("logged_in", "", { maxAge: 1 })

    res.status(StatusCode.OK).json(HttpResponse(StatusCode.OK, "Success loggout"))
  } catch (err: any) {
    const msg = err.message
    next(AppError.new(err.status || StatusCode.InternalServerError, msg))
  }
}
