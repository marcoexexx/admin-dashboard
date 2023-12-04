import { CookieOptions, NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcryptjs'
import getConfig from "../utils/getConfig";
import { CreateUserInput, LoginUserInput, Role } from "../schemas/user.schema";
import { db } from "../utils/db";
import { HttpDataResponse, HttpResponse } from "../utils/helper";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
import { signToken, verifyJwt } from "../utils/auth/jwt";
import { getGoogleAuthToken, getGoogleUser } from "../services/googleOAuth.service";
import { generateRandomUsername } from "../utils/generateRandomUsername";

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

// TODO: email verification
export async function registerUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    let data = {
      name,
      email,
      username: generateRandomUsername(12),
      password: hashedPassword,
      role: "User" as Role,
      verificationToken: undefined,   //  verificationToken generate
      verified: false
    }

    // set Admin if first time create user,
    const usersExist = await db.user.findMany();

    if (usersExist.length === 0) {
      data.role = "Admin"
    }

    const user = await db.user.create({ data });

    res.status(201).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "User already exists"))

    next(new AppError(500, msg))
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

    if (!code) return next(new AppError(401, "Authorization code not provided!"))

    const { id_token, access_token } = await getGoogleAuthToken(code)

    const { name, verified_email, email, picture } = await getGoogleUser({ id_token, access_token })

    if (!verified_email) return next(new AppError(403, "Google account not verified"))
    //
    // set Admin if first time create user,
    const usersExist = await db.user.findMany();

    if (usersExist.length === 0) {
      role = "Admin"
    }


    const user = await db.user.upsert({
      where: { email },
      create: {
        createdAt: new Date(),
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
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
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

    if (!user) return next(new AppError(400, "invalid email or password"))

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return next(new AppError(400, "invalid email or password"))

    const { accessToken, refreshToken } = await signToken(user)
    res.cookie("access_token", accessToken, accessTokenCookieOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    res.status(200).json(HttpDataResponse({ accessToken }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
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
      return next(new AppError(403, message))
    }

    const decoded = verifyJwt(refreshToken, "refreshTokenPublicKey")  //  decoded.sub == user.id
    if (!decoded) {
      res.cookie("logged_in", "", { maxAge: 1 })
      return next(new AppError(403, message))
    }

    const session = await redisClient.get(decoded.sub)
    if (!session) {
      res.cookie("logged_in", "", { maxAge: 1 })
      return next(new AppError(403, message))
    }

    const user = await db.user.findUnique({
      where: {
        id: JSON.parse(session).id
      }
    })
    if (!user) return next(new AppError(403, message))

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await signToken(user)
    res.cookie("access_token", newAccessToken, accessTokenCookieOptions)
    res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions)
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    res.status(200).json(HttpDataResponse({ accessToken: newAccessToken }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
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

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    await redisClient.del(user.id)

    res.cookie("access_token", "", { maxAge: 1 })
    res.cookie("refresh_token", "", { maxAge: 1 })
    res.cookie("logged_in", "", { maxAge: 1 })

    res.status(200).json(HttpResponse(200, "Success loggout"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}
