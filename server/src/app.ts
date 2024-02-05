import { resolve } from 'path';
import dotenv from 'dotenv'
import show_bannar from './utils/show_bannar';

const env = process.env.NODE_ENV || "development"
const path = env === "development"
  ? resolve(__dirname, "../.env")
  : resolve(__dirname, `../.${env}.env`)

dotenv.config({ path })


import https from 'https'
import fs from 'fs'

import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'

import validateEnv from './utils/validateEnv'
import getConfig from './utils/getConfig'
import cookieParser from 'cookie-parser'
import redisClient from './utils/connectRedis'

import authRouter from './routers/auth.route'
import meRouter from './routers/me.route'
import permissionRouter from './routers/permission.route'
import exchangeRouter from './routers/exchange.route'
import couponRouter from './routers/coupon.route'
import userRouter from './routers/user.route'
import productRouter from './routers/product.route'
import brandRouter from './routers/brand.route'
import categoryRouter from './routers/category.route'
import salesCategoryRouter from './routers/salesCategory.route'
import regionRouter from './routers/region.route'
import townshipRouter from './routers/township.route'
import userAddressRouter from './routers/userAddress.route'
import pickupAddressRouter from './routers/pickupAddress.route'

import generatePkRouter from './routers/generatePk.route'

import orderRouter from './routers/order.route'
import potentialOrderRouter from './routers/potentialOrder.route'

import accessLogRouter from './routers/accessLog.route'
import auditLogRouter from './routers/auditLog.route'

import helmet from 'helmet';
import useragent from 'express-useragent';

import AppError, { StatusCode } from './utils/appError';
import logging, { loggingMiddleware } from './middleware/logging/logging'
import { rateLimitMiddleware } from './middleware/rateLimit';
import { isMaintenance } from './middleware/isMaintenance';
import { checkBlockedUser } from './middleware/checkBlockedUser';


validateEnv()

if (!getConfig("hideBanner")) show_bannar()


export const app = express()

// Set Pub Template
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`)

/* Middlewares */
// CORS
app.use(cors({
  origin: getConfig("origin"),
  credentials: true,
}))

// Static
app.use("/img", express.static("public"))

// Helmet
app.use(helmet())

// Body parser (Build-in middlewares)
app.use(express.json({
  limit: '10kb' 
}))

// Cookie parser
app.use(cookieParser())

// Rate limit
app.use(rateLimitMiddleware)

// Logger
if (process.env.NODE_ENV === "development") app.use(loggingMiddleware)

// Cookie parser
app.use(cookieParser())

// Useragent
app.use(useragent.express())

// Is under the maintenance
app.use(isMaintenance)

// Check user is blocked
app.use(checkBlockedUser)


/* Routers */
app.get("/ping", async (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200)
    .json({ ping: "PONG" })
})

app.get("/healthcheck", async (_: Request, res: Response, next: NextFunction) => {
  let env = process.env.NODE_ENV
  await redisClient.get("try")
    .then((message) => res.status(200).json({ message, env }))
    .catch(next);
})

app.use("/api/v1/generate-pk", generatePkRouter)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/potential-orders", potentialOrderRouter)
app.use("/api/v1/me", meRouter)
app.use("/api/v1/permissions", permissionRouter)
app.use("/api/v1/exchanges", exchangeRouter)
app.use("/api/v1/coupons", couponRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/access-logs", accessLogRouter)
app.use("/api/v1/audit-logs", auditLogRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/brands", brandRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/sales-categories", salesCategoryRouter)
app.use("/api/v1/regions", regionRouter)
app.use("/api/v1/townships", townshipRouter)
app.use("/api/v1/addresses", userAddressRouter)
app.use("/api/v1/pickup-addresses", pickupAddressRouter)


// Unhandled Route
app.all("*", (req: Request, _: Response, next: NextFunction) => {
  return next(AppError.new(StatusCode.NotFound, `Route ${req.originalUrl} not found`))
})

// Global error handler
app.use(
  (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
    logging.error(error.message)

    res.status(error.status).json({
      status: error.status || StatusCode.InternalServerError,
      message: error.message
    })
  }
)

const host = getConfig("host") || "localhost";
const port = getConfig("port") || 8000;

if (require.main === module) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("certificate/key.pem", "utf8"),
      cert: fs.readFileSync("certificate/cert.pem", "utf8")
    }, 
    app
  )

  const isHttps = getConfig("https") === "true"

  const server = (isHttps ? httpsServer : app)
    .listen(port, () => {
      logging.info(`a ${getConfig("nodeEnv")} deplyoment.`)
      logging.log("🚀 Server is running on", `${isHttps ? "https" : "http"}://${host}:${port}`)
    })

  process.on("SIGINT", () => {
    console.log("\n")
    logging.info("Received SIGINT. Closing server and Redis connection...")
    server.close(async () => {
      await redisClient.quit()
      process.exit(0)
    })
  })
}
