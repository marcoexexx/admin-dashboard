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
exports.uploadImageProfileHandler = exports.uploadImageCoverHandler = exports.changeUserRoleHandler = exports.getUsersHandler = exports.getUserByUsernameHandler = exports.getUserHandler = exports.getMeHandler = exports.getMeProfileHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const helper_1 = require("../utils/helper");
const convertNumber_1 = require("../utils/convertNumber");
const db_1 = require("../utils/db");
function getMeProfileHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userSession = req.user;
            if (!userSession)
                return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
            const user = yield db_1.db.user.findUnique({
                where: {
                    id: userSession.id
                },
                include: {
                    orders: true,
                    favorites: true,
                    addresses: true,
                    reviews: true,
                    _count: true
                },
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getMeProfileHandler = getMeProfileHandler;
function getMeHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            res.status(200).json((0, helper_1.HttpDataResponse)({ user }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getMeHandler = getMeHandler;
function getUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const user = yield db_1.db.user.findUnique({
                where: {
                    id: userId
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getUserHandler = getUserHandler;
function getUserByUsernameHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username } = req.params;
            const user = yield db_1.db.user.findUnique({
                where: {
                    username
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getUserByUsernameHandler = getUserByUsernameHandler;
function getUsersHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filter = {}, pagination } = (0, convertNumber_1.convertNumericStrings)(req.query);
            const { id, name, email } = filter;
            const { page, pageSize } = pagination !== null && pagination !== void 0 ? pagination : { page: 1, pageSize: 10 };
            const offset = (page - 1) * pageSize;
            const users = yield db_1.db.user.findMany({
                where: {
                    id,
                    name,
                    email,
                },
                skip: offset,
                take: pageSize
            });
            res.status(200).json((0, helper_1.HttpListResponse)(users));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getUsersHandler = getUsersHandler;
// must use after, onlyAdmin middleware
function changeUserRoleHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { role } = req.body;
        try {
            const userExist = yield db_1.db.user.findUnique({ where: {
                    id: userId
                } });
            if (!userExist)
                return next(new appError_1.default(404, "User not found"));
            const updatedUser = yield db_1.db.user.update({
                where: {
                    id: userExist.id
                },
                data: {
                    role
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user: updatedUser }));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.changeUserRoleHandler = changeUserRoleHandler;
function uploadImageCoverHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore  for mocha testing
            const user = req.user;
            if (!user)
                return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
            const { image } = req.body;
            const updatedUser = yield db_1.db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    coverImage: image
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user: updatedUser }));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.uploadImageCoverHandler = uploadImageCoverHandler;
function uploadImageProfileHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore  for mocha testing
            const user = req.user;
            if (!user)
                return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
            const { image } = req.body;
            const updatedUser = yield db_1.db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    image
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ user: updatedUser }));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.uploadImageProfileHandler = uploadImageProfileHandler;
