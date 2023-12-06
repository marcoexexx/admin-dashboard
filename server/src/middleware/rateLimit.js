"use strict";
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
exports.rateLimitMiddleware = void 0;
const logging_1 = __importDefault(require("./logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const lodash_1 = require("lodash");
/* It allowed 60 requests per 1 minute */
const ALLOWED_REQUEST_COUNT = 60;
const ALLOWED_EXPIRY_TIME = 60; // in seconds -> 1 minute
function rateLimitMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.ip)
            return next(new appError_1.default(400, "Unable to determine client IP address."));
        const key = req.ip;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        try {
            const requestCount = yield connectRedis_1.default.get(key);
            let resetTime;
            let retryAfter;
            let ttl = yield connectRedis_1.default.ttl(key);
            if (!requestCount) {
                yield connectRedis_1.default.setEx(key, ALLOWED_EXPIRY_TIME, "1");
                resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME;
            }
            else {
                if ((0, lodash_1.parseInt)(requestCount, 10) > ALLOWED_REQUEST_COUNT) {
                    resetTime = (yield connectRedis_1.default.ttl(key)) + currentTimestamp;
                    retryAfter = resetTime - currentTimestamp;
                    res.set({
                        "Retry-After": retryAfter
                    });
                    return next(new appError_1.default(429, "Too many request: Rate limit exceeded. Try again later"));
                }
                else {
                    yield connectRedis_1.default.incr(key);
                    resetTime = currentTimestamp + ALLOWED_EXPIRY_TIME;
                }
            }
            res.set({
                "X-Rate-Limit-Limit": ALLOWED_REQUEST_COUNT,
                "X-Rate-Limit-Remaining": requestCount !== null ? ALLOWED_REQUEST_COUNT - (0, lodash_1.parseInt)(requestCount, 10) : ALLOWED_REQUEST_COUNT - 0,
                "X-Rate-Limit-Reset": ttl
            });
            next();
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.rateLimitMiddleware = rateLimitMiddleware;
