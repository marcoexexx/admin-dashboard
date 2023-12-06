"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
class AppError extends Error {
    constructor(statusCode = 500, message) {
        super(message);
        this.status = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
const errorHandler = (statusCode, next) => (err) => {
    const msg = (err === null || err === void 0 ? void 0 : err.message) || "unknown error";
    logging_1.default.error(msg);
    next(new AppError(statusCode, msg));
};
exports.errorHandler = errorHandler;
