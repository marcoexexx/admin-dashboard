import { resolve } from 'path';
import dotenv from 'dotenv'

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
import AppError, { errorHandler } from './utils/appError'
import redisClient from './utils/connectRedis'

import authRouter from './routers/auth.route'
import orderRouter from './routers/order.route'
import meRouter from './routers/me.route'
import permissionRouter from './routers/permission.route'
import exchangeRouter from './routers/exchange.route'
import couponRouter from './routers/coupon.route'
import userRouter from './routers/user.route'
import accessLogRouter from './routers/accessLog.route'
import productRouter from './routers/product.route'
import brandRouter from './routers/brand.route'
import categoryRouter from './routers/category.route'
import salesCategoryRouter from './routers/salesCategory.route'
import regionRouter from './routers/region.route'
import townshipRouter from './routers/township.route'
import userAddressRouter from './routers/userAddress.route'

import helmet from 'helmet';
import useragent from 'express-useragent';
import logging, { loggingMiddleware } from './middleware/logging/logging'
import { rateLimitMiddleware } from './middleware/rateLimit';


validateEnv()


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


/* Routers */
app.get("/ping", async (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200)
    .json({ ping: "PONG" })
})

app.get("/healthcheck", async (_: Request, res: Response, next: NextFunction) => {
  let env = process.env.NODE_ENV
  await redisClient.get("try")
    .then((message) => res.status(200).json({ message, env }))
    .catch(errorHandler(500, next));
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/me", meRouter)
app.use("/api/v1/permissions", permissionRouter)
app.use("/api/v1/exchanges", exchangeRouter)
app.use("/api/v1/coupons", couponRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/access-logs", accessLogRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/brands", brandRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/sales-categories", salesCategoryRouter)
app.use("/api/v1/regions", regionRouter)
app.use("/api/v1/townships", townshipRouter)
app.use("/api/v1/addresses", userAddressRouter)


// Unhandled Route
app.all("*", (req: Request, _: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`))
})

// Global error handler
app.use(
  (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
    error.status = error.status || 500;

    res.status(error.status).json({
      status: error.status,
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

  const server = httpsServer.listen(port, () => {
    logging.info(`a ${getConfig("nodeEnv")} deplyoment.`)
    logging.log("🚀 Server is running on", `https://${host}:${port}`)
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
