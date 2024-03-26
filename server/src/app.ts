import dotenv from "dotenv";
import { resolve } from "path";
import show_bannar from "./utils/show_bannar";

const env = process.env.NODE_ENV || "development";
const path = env === "development"
  ? resolve(__dirname, "../.env")
  : resolve(__dirname, `../.${env}.env`);

dotenv.config({ path });

import fs from "fs";
import https from "https";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import cookieParser from "cookie-parser";
import redisClient from "./utils/connectRedis";
import getConfig from "./utils/getConfig";
import validateEnv from "./utils/validateEnv";

import authRouter from "./routers/auth.route";
import brandRouter from "./routers/brand.route";
import categoryRouter from "./routers/category.route";
import couponRouter from "./routers/coupon.route";
import exchangeRouter from "./routers/exchange.route";
import meRouter from "./routers/me.route";
import pickupAddressRouter from "./routers/pickupAddress.route";
import productRouter from "./routers/product.route";
import regionRouter from "./routers/region.route";
import salesCategoryRouter from "./routers/salesCategory.route";
import shopownerRouter from "./routers/shopowner.route";
import townshipRouter from "./routers/township.route";
import userRouter from "./routers/user.route";
import userAddressRouter from "./routers/userAddress.route";

import cartRouter from "./routers/cart.route";
import permissionRouter from "./routers/permission.route";
import roleRouter from "./routers/role.router";

import orderRouter from "./routers/order.route";
import potentialOrderRouter from "./routers/potentialOrder.route";

import accessLogRouter from "./routers/accessLog.route";
import auditLogRouter from "./routers/auditLog.route";

import useragent from "express-useragent";
import helmet from "helmet";

import { safeDeserializeUser } from "./middleware/deserializeUser";
import { isMaintenance } from "./middleware/isMaintenance";
import logging, { loggingMiddleware } from "./middleware/logging/logging";
import { rateLimitMiddleware } from "./middleware/rateLimit";
import AppError, { StatusCode } from "./utils/appError";

validateEnv();

if (!getConfig("hideBanner")) show_bannar();

export const app = express();

const URL_PREFIX = getConfig("urlPrefix");

// Set Pub Template
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

/* Middlewares */
// CORS
app.use(cors({
  origin: [getConfig("origin"), getConfig("websiteOrigin")],
  credentials: true,
}));

// Static
app.use("/img", express.static("public"));

// Helmet
app.use(helmet());

// Body parser (Build-in middlewares)
app.use(express.json({
  limit: "10kb",
}));

// Cookie parser
app.use(cookieParser());

// Rate limit
app.use(rateLimitMiddleware);

// Logger
if (process.env.NODE_ENV === "development") app.use(loggingMiddleware);

// Useragent
app.use(useragent.express());

// Is under the maintenance
app.use(safeDeserializeUser);

// Is under the maintenance
app.use(isMaintenance);

/* Routers */
app.get(
  "/ping",
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200)
      .json({ ping: "PONG" });
  },
);

app.get(
  "/healthcheck",
  async (_: Request, res: Response, next: NextFunction) => {
    let env = process.env.NODE_ENV;
    await redisClient.get("try")
      .then((message) => res.status(200).json({ message, env }))
      .catch(next);
  },
);

app.use(`${URL_PREFIX}/auth`, authRouter);
app.use(`${URL_PREFIX}/shopowners`, shopownerRouter);
app.use(`${URL_PREFIX}/orders`, orderRouter);
app.use(`${URL_PREFIX}/potential-orders`, potentialOrderRouter);
app.use(`${URL_PREFIX}/me`, meRouter);
app.use(`${URL_PREFIX}/exchanges`, exchangeRouter);
app.use(`${URL_PREFIX}/coupons`, couponRouter);
app.use(`${URL_PREFIX}/users`, userRouter);
app.use(`${URL_PREFIX}/access-logs`, accessLogRouter);
app.use(`${URL_PREFIX}/audit-logs`, auditLogRouter);
app.use(`${URL_PREFIX}/products`, productRouter);
app.use(`${URL_PREFIX}/brands`, brandRouter);
app.use(`${URL_PREFIX}/categories`, categoryRouter);
app.use(`${URL_PREFIX}/sales-categories`, salesCategoryRouter);
app.use(`${URL_PREFIX}/regions`, regionRouter);
app.use(`${URL_PREFIX}/townships`, townshipRouter);
app.use(`${URL_PREFIX}/addresses`, userAddressRouter);
app.use(`${URL_PREFIX}/pickup-addresses`, pickupAddressRouter);
app.use(`${URL_PREFIX}/roles`, roleRouter);
app.use(`${URL_PREFIX}/permissions`, permissionRouter);
app.use(`${URL_PREFIX}/cart`, cartRouter);

// Unhandled Route
app.all("*", (req: Request, _: Response, next: NextFunction) => {
  return next(
    AppError.new(
      StatusCode.NotFound,
      `Route ${req.originalUrl} not found`,
    ),
  );
});

// Global error handler
app.use(
  (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
    logging.error(error.message);

    res.status(error.status).json({
      status: error.status || StatusCode.InternalServerError,
      message: error.message,
    });
  },
);

const port = getConfig("port") || 8000;

if (require.main === module) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("certificate/key.pem", "utf8"),
      cert: fs.readFileSync("certificate/cert.pem", "utf8"),
    },
    app,
  );

  const isHttps = getConfig("https") === "true";

  const server = (isHttps ? httpsServer : app)
    .listen(port, () => {
      logging.info(`a ${getConfig("nodeEnv")} deplyoment.`);
      logging.log(
        "🚀 Server is running on",
        `${isHttps ? "https" : "http"}://0.0.0.0:${port}`,
      );
    });

  process.on("SIGINT", () => {
    console.log("\n");
    logging.info(
      "Received SIGINT. Closing server and Redis connection...",
    );
    server.close(async () => {
      await redisClient.quit();
      process.exit(0);
    });
  });
}
