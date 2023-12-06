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
exports.permissionsSalesCategoriesHandler = exports.permissionsCategoriesHandler = exports.permissionsBrandsHandler = exports.permissionsProductsHandler = exports.permissionsExchangeHandler = exports.permissionsUserHandler = void 0;
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const permissions_1 = require("../utils/auth/permissions");
const helper_1 = require("../utils/helper");
const brand_permission_1 = require("../utils/auth/permissions/brand.permission");
const category_permission_1 = require("../utils/auth/permissions/category.permission");
const salesCategory_permission_1 = require("../utils/auth/permissions/salesCategory.permission");
const exchange_permission_1 = require("../utils/auth/permissions/exchange.permission");
function permissionsUserHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(permissions_1.userPermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "user" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsUserHandler = permissionsUserHandler;
function permissionsExchangeHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(exchange_permission_1.exchangePermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "user" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsExchangeHandler = permissionsExchangeHandler;
function permissionsProductsHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(permissions_1.productPermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "product" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsProductsHandler = permissionsProductsHandler;
function permissionsBrandsHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(brand_permission_1.brandPermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "brand" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsBrandsHandler = permissionsBrandsHandler;
function permissionsCategoriesHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(category_permission_1.categoryPermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "category" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsCategoriesHandler = permissionsCategoriesHandler;
function permissionsSalesCategoriesHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissions = (0, mapValues_1.default)(salesCategory_permission_1.salesCategoryPermission, value => value());
            res
                .status(200)
                .json((0, helper_1.HttpDataResponse)({ permissions, label: "sales-category" }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.permissionsSalesCategoriesHandler = permissionsSalesCategoriesHandler;
