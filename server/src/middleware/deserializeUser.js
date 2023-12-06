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
exports.deserializeUser = void 0;
const logging_1 = __importDefault(require("./logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/auth/jwt");
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const db_1 = require("../utils/db");
function deserializeUser(req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorizationHeader = req.header("authorization");
            let accessToken = authorizationHeader && authorizationHeader.startsWith("Bearer")
                ? authorizationHeader.split(" ")[1]
                : req.cookies.access_token;
            if (!accessToken)
                return next(new appError_1.default(401, "You are not logged in"));
            const decoded = (0, jwt_1.verifyJwt)(accessToken, "accessTokenPublicKey"); //  decoded.sub == user.id
            if (!decoded)
                return next(new appError_1.default(401, "Invalid token or user doesn't exist"));
            const session = yield connectRedis_1.default.get(decoded.sub);
            if (!session)
                return next(new appError_1.default(401, "Invalid token or session has expired"));
            const user = yield db_1.db.user.findFirst({
                where: {
                    id: JSON.parse(session).id
                }
            });
            if (!user)
                return next(new appError_1.default(401, "Invalid token or session has expired"));
            // @ts-ignore  for mocha testing
            req.user = user;
            next();
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.deserializeUser = deserializeUser;
