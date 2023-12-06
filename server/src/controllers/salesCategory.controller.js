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
exports.updateSalesCategoryHandler = exports.deleteSalesCategoryHandler = exports.createMultiSalesCategoriesHandler = exports.createSalesCategoryHandler = exports.getSalesCategoryHandler = exports.getSalesCategoriesHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = require("../utils/db");
const helper_1 = require("../utils/helper");
const library_1 = require("@prisma/client/runtime/library");
function getSalesCategoriesHandler(_, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO: filter
            const categories = yield db_1.db.salesCategory.findMany({
                where: {}
            });
            res.status(200).json((0, helper_1.HttpListResponse)(categories));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getSalesCategoriesHandler = getSalesCategoriesHandler;
function getSalesCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { salesCategoryId } = req.params;
            const salesCategory = yield db_1.db.salesCategory.findUnique({
                where: {
                    id: salesCategoryId
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ salesCategory }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getSalesCategoryHandler = getSalesCategoryHandler;
function createSalesCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const category = yield db_1.db.salesCategory.create({
                data: { name },
            });
            res.status(201).json((0, helper_1.HttpDataResponse)({ category }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Sales category already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createSalesCategoryHandler = createSalesCategoryHandler;
function createMultiSalesCategoriesHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            yield db_1.db.salesCategory.createMany({
                data,
                skipDuplicates: true
            });
            res.status(201).json((0, helper_1.HttpResponse)(201, "Success"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Sales Category already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createMultiSalesCategoriesHandler = createMultiSalesCategoriesHandler;
function deleteSalesCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { salesCategoryId } = req.params;
            yield db_1.db.salesCategory.delete({
                where: {
                    id: salesCategoryId
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
exports.deleteSalesCategoryHandler = deleteSalesCategoryHandler;
function updateSalesCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { salesCategoryId } = req.params;
            const data = req.body;
            const category = yield db_1.db.salesCategory.update({
                where: {
                    id: salesCategoryId,
                },
                data
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ category }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.updateSalesCategoryHandler = updateSalesCategoryHandler;
