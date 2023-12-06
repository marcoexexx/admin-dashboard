"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const env = process.env.NODE_ENV || "development";
const path = env === "development"
    ? (0, path_1.resolve)(__dirname, "../.env")
    : (0, path_1.resolve)(__dirname, `../.${env}.env`);
dotenv_1.default.config({ path });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const getConfig_1 = __importDefault(require("./utils/getConfig"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appError_1 = __importStar(require("./utils/appError"));
const connectRedis_1 = __importDefault(require("./utils/connectRedis"));
const auth_route_1 = __importDefault(require("./routers/auth.route"));
const me_route_1 = __importDefault(require("./routers/me.route"));
const permission_route_1 = __importDefault(require("./routers/permission.route"));
const exchange_route_1 = __importDefault(require("./routers/exchange.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const accessLog_route_1 = __importDefault(require("./routers/accessLog.route"));
const product_route_1 = __importDefault(require("./routers/product.route"));
const brand_route_1 = __importDefault(require("./routers/brand.route"));
const category_route_1 = __importDefault(require("./routers/category.route"));
const salesCategory_route_1 = __importDefault(require("./routers/salesCategory.route"));
const helmet_1 = __importDefault(require("helmet"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const logging_1 = __importStar(require("./middleware/logging/logging"));
const rateLimit_1 = require("./middleware/rateLimit");
(0, validateEnv_1.default)();
exports.app = (0, express_1.default)();
/* Middlewares */
// CORS
exports.app.use((0, cors_1.default)({
    origin: (0, getConfig_1.default)("origin"),
    credentials: true,
}));
// Static
exports.app.use("/img", express_1.default.static("public"));
// Helmet
exports.app.use((0, helmet_1.default)());
// Body parser (Build-in middlewares)
exports.app.use(express_1.default.json({
    limit: '10kb'
}));
// Cookie parser
exports.app.use((0, cookie_parser_1.default)());
// Rate limit
exports.app.use(rateLimit_1.rateLimitMiddleware);
// Logger
if (process.env.NODE_ENV === "development")
    exports.app.use(logging_1.loggingMiddleware);
// Cookie parser
exports.app.use((0, cookie_parser_1.default)());
// Useragent
exports.app.use(express_useragent_1.default.express());
/* Routers */
exports.app.get("/ping", (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200)
        .json({ ping: "PONG" });
}));
exports.app.get("/healthcheck", (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield connectRedis_1.default.get("try")
        .then((message) => res.status(200).json({ message }))
        .catch((0, appError_1.errorHandler)(500, next));
}));
exports.app.use("/api/v1/auth", auth_route_1.default);
exports.app.use("/api/v1/me", me_route_1.default);
exports.app.use("/api/v1/permissions", permission_route_1.default);
exports.app.use("/api/v1/exchanges", exchange_route_1.default);
exports.app.use("/api/v1/users", user_route_1.default);
exports.app.use("/api/v1/access-logs", accessLog_route_1.default);
exports.app.use("/api/v1/products", product_route_1.default);
exports.app.use("/api/v1/brands", brand_route_1.default);
exports.app.use("/api/v1/categories", category_route_1.default);
exports.app.use("/api/v1/sales-categories", salesCategory_route_1.default);
// Unhandled Route
exports.app.all("*", (req, _, next) => {
    next(new appError_1.default(404, `Route ${req.originalUrl} not found`));
});
// Global error handler
exports.app.use((error, _req, res, _next) => {
    error.status = error.status || 500;
    res.status(error.status).json({
        status: error.status,
        message: error.message
    });
});
const port = (0, getConfig_1.default)("port") || 8000;
if (require.main === module) {
    const server = exports.app.listen(port, () => {
        logging_1.default.log("Server is running on port", port);
    });
    process.on("SIGINT", () => {
        console.log("\n");
        logging_1.default.info("Received SIGINT. Closing server and Redis connection...");
        server.close(() => {
            connectRedis_1.default.quit();
            process.exit(0);
        });
    });
}
