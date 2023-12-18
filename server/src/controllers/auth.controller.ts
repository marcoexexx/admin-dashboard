import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import { CookieOptions, NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateUserInput, LoginUserInput, Role, VerificationEmailInput } from "../schemas/user.schema";
import { HttpDataResponse, HttpResponse } from "../utils/helper";
import { signToken, verifyJwt } from "../utils/auth/jwt";
import { getGoogleAuthToken, getGoogleUser } from "../services/googleOAuth.service";
import { generateRandomUsername } from "../utils/generateRandomUsername";
import { createVerificationCode } from "../utils/createVeriicationCode";
import { db } from "../utils/db";
import redisClient from "../utils/connectRedis";
import getConfig from "../utils/getConfig";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import Email from "../utils/email";

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

    const hashedPassword = await bcrypt.hash(password, 12);

    let data = {
      name,
      email,
      username: generateRandomUsername(12),
      password: hashedPassword,
      role: "User" as Role,
      verified: false,
      verificationCode: undefined as undefined | string
    }

    // set Admin if first time create user,
    const usersExistCount = await db.user.count();
    if (usersExistCount === 0) {
      data.role = "Admin"
    }

    // check user already exists
    const userExists = await db.user.findUnique({ 
      where: {
        email
      }
    })
    if (userExists) return next(new AppError(409, "User already exists")) 

    // Email verification
    const { hashedVerificationCode, verificationCode } = createVerificationCode()
    data.verificationCode = hashedVerificationCode
    //
    // Crete new user
    const user = await db.user.create({ data });
    const redirectUrl = `${getConfig('origin')}/verify-email/${verificationCode}`


    try {
      await new Email(user, redirectUrl).sendVerificationCode()

      res.status(201).json(HttpDataResponse({ 
        user,
        redirectUrl: getConfig("nodeEnv") === "development" ? redirectUrl : undefined
      }))
    } catch (err: any) {
      user.verificationCode = null

      return next(new AppError(500, "There was an error sending email, please try again" + err.message))
    }
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "User already exists"))

    next(new AppError(500, msg))
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

    const user = await db.user.findFirst({
      where: {
        verificationCode
      }
    })

    if (!user) return next(new AppError(401, "Could not verify email"))

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        verified: true,
        verificationCode: null
      }
    })

    res.status(200).json(HttpResponse(200, "Email verified successfully"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
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

    // Check verified
    if (!user.verified) return next(new AppError(400, 'You are not verified'))

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return next(new AppError(400, "invalid email or password"))

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
    await db.accessLog.create({
      data: {
        userId: user.id,
        ip: req.ip || "unknown ip",
        browser,
        platform,
      }
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
