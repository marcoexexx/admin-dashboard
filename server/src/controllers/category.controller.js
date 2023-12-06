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
exports.updateCategoryHandler = exports.deleteCategoryHandler = exports.createMultiCategoriesHandler = exports.createCategoryHandler = exports.getCategoryHandler = exports.getCategoriesHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = require("../utils/db");
const helper_1 = require("../utils/helper");
const library_1 = require("@prisma/client/runtime/library");
const convertNumber_1 = require("../utils/convertNumber");
function getCategoriesHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filter = {}, pagination, orderBy } = (0, convertNumber_1.convertNumericStrings)(req.query);
            const { id, name } = filter || { status: undefined };
            const { page, pageSize } = pagination !== null && pagination !== void 0 ? pagination : { page: 1, pageSize: 10 };
            const offset = (page - 1) * pageSize;
            const [count, categories] = yield db_1.db.$transaction([
                db_1.db.category.count(),
                db_1.db.category.findMany({
                    where: {
                        id,
                        name
                    },
                    orderBy,
                    skip: offset,
                    take: pageSize,
                })
            ]);
            res.status(200).json((0, helper_1.HttpListResponse)(categories, count));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getCategoriesHandler = getCategoriesHandler;
function getCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoryId } = req.params;
            const category = yield db_1.db.category.findUnique({
                where: {
                    id: categoryId
                }
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
exports.getCategoryHandler = getCategoryHandler;
function createCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const category = yield db_1.db.category.create({
                data: { name },
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ category }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Category already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createCategoryHandler = createCategoryHandler;
function createMultiCategoriesHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            yield db_1.db.category.createMany({
                data,
                skipDuplicates: true
            });
            res.status(201).json((0, helper_1.HttpResponse)(201, "Success"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Category already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createMultiCategoriesHandler = createMultiCategoriesHandler;
function deleteCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoryId } = req.params;
            yield db_1.db.category.delete({
                where: {
                    id: categoryId
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
exports.deleteCategoryHandler = deleteCategoryHandler;
function updateCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { categoryId } = req.params;
            const data = req.body;
            const category = yield db_1.db.category.update({
                where: {
                    id: categoryId,
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
exports.updateCategoryHandler = updateCategoryHandler;
