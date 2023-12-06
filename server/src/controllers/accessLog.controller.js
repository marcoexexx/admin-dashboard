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
exports.deleteAccessLogsHandler = exports.getAccessLogsHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = require("../utils/db");
const helper_1 = require("../utils/helper");
function getAccessLogsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // @ts-ignore  for mocha
            const user = req.user;
            if (!user)
                return next(new appError_1.default(400, "Session has expired or user doesn't exist"));
            const [count, logs] = yield db_1.db.$transaction([
                db_1.db.accessLog.count(),
                db_1.db.accessLog.findMany({
                    where: {
                        userId: user.id
                    },
                    include: {
                        user: true
                    }
                })
            ]);
            res.status(200).json((0, helper_1.HttpListResponse)(logs, count));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getAccessLogsHandler = getAccessLogsHandler;
function deleteAccessLogsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { accessLogId } = req.params;
            yield db_1.db.accessLog.delete({
                where: {
                    id: accessLogId
                }
            });
            res.status(200).json((0, helper_1.HttpResponse)(200, "Success deleted"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.deleteAccessLogsHandler = deleteAccessLogsHandler;
