"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredUser = void 0;
const logging_1 = __importDefault(require("./logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
function requiredUser(req, _, next) {
    try {
        // @ts-ignore  for mocha testing
        const user = req.user;
        if (!user)
            return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
        next();
    }
    catch (err) {
        const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
        logging_1.default.error(msg);
        next(new appError_1.default(500, msg));
    }
}
exports.requiredUser = requiredUser;
