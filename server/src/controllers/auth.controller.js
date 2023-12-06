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
exports.logoutHandler = exports.refreshTokenHandler = exports.loginUserHandler = exports.googleOAuthHandler = exports.registerUserHandler = void 0;
const library_1 = require("@prisma/client/runtime/library");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getConfig_1 = __importDefault(require("../utils/getConfig"));
const db_1 = require("../utils/db");
const helper_1 = require("../utils/helper");
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const jwt_1 = require("../utils/auth/jwt");
const googleOAuth_service_1 = require("../services/googleOAuth.service");
const generateRandomUsername_1 = require("../utils/generateRandomUsername");
const cookieOptions = {
    httpOnly: true,
    sameSite: "lax"
};
if ((0, getConfig_1.default)("nodeEnv") === "production")
    cookieOptions.secure = true;
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookieOptions), { expires: new Date(Date.now() + (0, getConfig_1.default)("accessTokenExpiresIn") * 1000), maxAge: (0, getConfig_1.default)("accessTokenExpiresIn") * 1000 });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookieOptions), { expires: new Date(Date.now() + (0, getConfig_1.default)("refreshTokenExpiresIn") * 1000), maxAge: (0, getConfig_1.default)("refreshTokenExpiresIn") * 1000 });
// TODO: email verification
function registerUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            let data = {
                name,
                email,
                username: (0, generateRandomUsername_1.generateRandomUsername)(12),
                password: hashedPassword,
                role: "User",
                verificationToken: undefined, //  verificationToken generate
                verified: false
            };
            // set Admin if first time create user,
            const usersExist = yield db_1.db.user.findMany();
            if (usersExist.length === 0) {
                data.role = "Admin";
            }
            const user = yield db_1.db.user.create({ data });
            res.status(201).json((0, helper_1.HttpDataResponse)({ user }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "User already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.registerUserHandler = registerUserHandler;
function googleOAuthHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const code = req.query.code;
            const pathUrl = req.query.state || "/";
            let role = "User";
            if (!code)
                return next(new appError_1.default(401, "Authorization code not provided!"));
            const { id_token, access_token } = yield (0, googleOAuth_service_1.getGoogleAuthToken)(code);
            const { name, verified_email, email, picture } = yield (0, googleOAuth_service_1.getGoogleUser)({ id_token, access_token });
            if (!verified_email)
                return next(new appError_1.default(403, "Google account not verified"));
            //
            // set Admin if first time create user,
            const usersExist = yield db_1.db.user.findMany();
            if (usersExist.length === 0) {
                role = "Admin";
            }
            const user = yield db_1.db.user.upsert({
                where: { email },
                create: {
                    createdAt: new Date(),
                    name,
                    username: (0, generateRandomUsername_1.generateRandomUsername)(12),
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
            });
            if (!user)
                return res.redirect(`${(0, getConfig_1.default)("origin")}/oauth/error`);
            const { accessToken, refreshToken } = yield (0, jwt_1.signToken)(user);
            res.cookie("access_token", accessToken, accessTokenCookieOptions);
            res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
            res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
            res.redirect(`${(0, getConfig_1.default)("origin")}${pathUrl}`);
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.googleOAuthHandler = googleOAuthHandler;
function loginUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield db_1.db.user.findUnique({
                where: {
                    email
                }
            });
            if (!user)
                return next(new appError_1.default(400, "invalid email or password"));
            const validPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!validPassword)
                return next(new appError_1.default(400, "invalid email or password"));
            const { accessToken, refreshToken } = yield (0, jwt_1.signToken)(user);
            res.cookie("access_token", accessToken, accessTokenCookieOptions);
            res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
            res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
            const platform = req.useragent.platform;
            const browser = `${req.useragent.browser}/${req.useragent.version}`;
            // create access log
            yield db_1.db.accessLog.create({
                data: {
                    userId: user.id,
                    ip: req.ip || "unknown ip",
                    browser,
                    platform,
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ accessToken }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.loginUserHandler = loginUserHandler;
function refreshTokenHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refresh_token;
            const message = "Could not refresh access token";
            if (!refreshToken) {
                logging_1.default.error("Failed refresh:", message, refreshToken);
                res.cookie("logged_in", "", { maxAge: 1 });
                return next(new appError_1.default(403, message));
            }
            const decoded = (0, jwt_1.verifyJwt)(refreshToken, "refreshTokenPublicKey"); //  decoded.sub == user.id
            if (!decoded) {
                res.cookie("logged_in", "", { maxAge: 1 });
                return next(new appError_1.default(403, message));
            }
            const session = yield connectRedis_1.default.get(decoded.sub);
            if (!session) {
                res.cookie("logged_in", "", { maxAge: 1 });
                return next(new appError_1.default(403, message));
            }
            const user = yield db_1.db.user.findUnique({
                where: {
                    id: JSON.parse(session).id
                }
            });
            if (!user)
                return next(new appError_1.default(403, message));
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = yield (0, jwt_1.signToken)(user);
            res.cookie("access_token", newAccessToken, accessTokenCookieOptions);
            res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions);
            res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
            res.status(200).json((0, helper_1.HttpDataResponse)({ accessToken: newAccessToken }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.refreshTokenHandler = refreshTokenHandler;
function logoutHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore  for mocha testing
            const user = req.user;
            if (!user)
                return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
            yield connectRedis_1.default.del(user.id);
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });
            res.cookie("logged_in", "", { maxAge: 1 });
            res.status(200).json((0, helper_1.HttpResponse)(200, "Success loggout"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.logoutHandler = logoutHandler;
