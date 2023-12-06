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
exports.deleteExchangeHandler = exports.createMultiExchangesHandler = exports.createExchangeHandler = exports.updateExchangeHandler = exports.getExchangeHandler = exports.getExchangesHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = require("../utils/db");
const helper_1 = require("../utils/helper");
const convertNumber_1 = require("../utils/convertNumber");
const library_1 = require("@prisma/client/runtime/library");
function getExchangesHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filter = {}, pagination, orderBy } = (0, convertNumber_1.convertNumericStrings)(req.query);
            const { id, from, to, endDate, startDate, rate } = filter || { status: undefined };
            const { page, pageSize } = pagination !== null && pagination !== void 0 ? pagination : { page: 1, pageSize: 10 };
            const offset = (page - 1) * pageSize;
            const [count, exchanges] = yield db_1.db.$transaction([
                db_1.db.exchange.count(),
                db_1.db.exchange.findMany({
                    where: {
                        id,
                        from,
                        to,
                        date: {
                            lte: endDate,
                            gte: startDate
                        },
                        rate
                    },
                    orderBy,
                    skip: offset,
                    take: pageSize,
                })
            ]);
            res.status(200).json((0, helper_1.HttpListResponse)(exchanges, count));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getExchangesHandler = getExchangesHandler;
function getExchangeHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { exchangeId } = req.params;
            const exchange = yield db_1.db.exchange.findUnique({
                where: {
                    id: exchangeId
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ exchange }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getExchangeHandler = getExchangeHandler;
function updateExchangeHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { exchangeId } = req.params;
            const data = req.body;
            const exchange = yield db_1.db.exchange.update({
                where: {
                    id: exchangeId
                },
                data
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ exchange }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.updateExchangeHandler = updateExchangeHandler;
function createExchangeHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { from, to, rate, date } = req.body;
            const exchange = yield db_1.db.exchange.create({
                data: {
                    from,
                    date,
                    to,
                    rate
                },
            });
            res.status(201).json((0, helper_1.HttpDataResponse)({ exchange }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Exchange already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createExchangeHandler = createExchangeHandler;
function createMultiExchangesHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            yield db_1.db.exchange.createMany({
                data,
                skipDuplicates: true
            });
            res.status(201).json((0, helper_1.HttpResponse)(201, "Success"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Exchange already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createMultiExchangesHandler = createMultiExchangesHandler;
function deleteExchangeHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { exchangeId } = req.params;
            yield db_1.db.exchange.delete({
                where: {
                    id: exchangeId
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
exports.deleteExchangeHandler = deleteExchangeHandler;
