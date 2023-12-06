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
exports.uploadImagesProductHandler = exports.updateProductHandler = exports.deleteProductHandler = exports.createMultiProductsHandler = exports.createProductHandler = exports.getProductHandler = exports.getProductsHandler = void 0;
const db_1 = require("../utils/db");
const appError_1 = __importDefault(require("../utils/appError"));
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const helper_1 = require("../utils/helper");
const library_1 = require("@prisma/client/runtime/library");
const convertNumber_1 = require("../utils/convertNumber");
const convertStringToBoolean_1 = require("../utils/convertStringToBoolean");
// TODO: specification filter
function getProductsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filter = {}, pagination, include: includes, orderBy } = (0, convertNumber_1.convertNumericStrings)(req.query);
            const include = (0, convertStringToBoolean_1.convertStringToBoolean)(includes);
            const { id, brand, brandId, title, price, overview, features, warranty, categories, colors, instockStatus, description, type, dealerPrice, marketPrice, discount, status, priceUnit, salesCategory, likedUsers, } = filter || { status: undefined };
            const { page, pageSize } = pagination !== null && pagination !== void 0 ? pagination : { page: 1, pageSize: 10 };
            const offset = (page - 1) * pageSize;
            const [count, products] = yield db_1.db.$transaction([
                db_1.db.product.count(),
                db_1.db.product.findMany({
                    where: {
                        id,
                        brand,
                        brandId,
                        title,
                        price,
                        overview,
                        features,
                        warranty,
                        categories,
                        colors,
                        instockStatus,
                        description,
                        type,
                        dealerPrice,
                        marketPrice,
                        discount,
                        status,
                        priceUnit,
                        salesCategory,
                        likedUsers,
                    },
                    orderBy,
                    skip: offset,
                    take: pageSize,
                    // @ts-ignore
                    include
                })
            ]);
            res.status(200).json((0, helper_1.HttpListResponse)(products, count));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getProductsHandler = getProductsHandler;
function getProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const product = yield db_1.db.product.findUnique({
                where: {
                    id: productId
                }
            });
            if (!product)
                return next(new appError_1.default(404, "Product not found"));
            res.status(200).json((0, helper_1.HttpDataResponse)({ product }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    });
}
exports.getProductHandler = getProductHandler;
function createProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { price, brandId, title, specification, overview, features, warranty, colors, instockStatus, description, type, dealerPrice, marketPrice, discount, priceUnit, salesCategory, categories, quantity, status } = req.body;
            const new_product = yield db_1.db.product.create({
                data: {
                    price,
                    brandId,
                    title,
                    specification: {
                        create: specification
                    },
                    overview,
                    features,
                    warranty,
                    colors,
                    instockStatus,
                    description,
                    type,
                    dealerPrice,
                    marketPrice,
                    discount,
                    status,
                    priceUnit,
                    categories: {
                        create: categories.map(id => ({
                            category: {
                                connect: { id }
                            }
                        }))
                    },
                    salesCategory: {
                        create: salesCategory.map(id => ({
                            salesCategory: {
                                connect: { id }
                            }
                        }))
                    },
                    quantity,
                }
            });
            res.status(201).json((0, helper_1.HttpDataResponse)({ product: new_product }));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if (err instanceof library_1.PrismaClientKnownRequestError && err.code === "P2002")
                return next(new appError_1.default(409, "Category name already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.createProductHandler = createProductHandler;
function createMultiProductsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            yield db_1.db.product.createMany({
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
exports.createMultiProductsHandler = createMultiProductsHandler;
function deleteProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const product = yield db_1.db.product.findUnique({
                where: {
                    id: productId
                }
            });
            if (!product)
                return next(new appError_1.default(404, `Product not found`));
            logging_1.default.log(yield db_1.db.specification.count());
            yield db_1.db.specification.deleteMany({
                where: {
                    productId,
                }
            });
            yield db_1.db.productCategory.deleteMany({
                where: {
                    productId,
                }
            });
            yield db_1.db.productSalesCategory.deleteMany({
                where: {
                    productId,
                }
            });
            yield db_1.db.product.delete({
                where: {
                    id: productId
                }
            });
            res.status(200).json((0, helper_1.HttpResponse)(200, "Success delete"));
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            if ((err === null || err === void 0 ? void 0 : err.code) === "23505")
                next(new appError_1.default(409, "data already exists"));
            next(new appError_1.default(500, msg));
        }
    });
}
exports.deleteProductHandler = deleteProductHandler;
function updateProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const { price, brandId, title, specification, overview, features, warranty, colors, instockStatus, description, type, dealerPrice, marketPrice, discount, priceUnit, salesCategory, categories, quantity, status } = req.body;
            // remove association data: productCategory
            yield db_1.db.productCategory.deleteMany({
                where: {
                    productId,
                }
            });
            // remove association data: productSalesCategory
            yield db_1.db.productSalesCategory.deleteMany({
                where: {
                    productId,
                }
            });
            // TODO: relation bug
            // disconnect and remove specifications
            yield db_1.db.product.update({
                where: {
                    id: productId
                },
                data: {
                    specification: {
                        disconnect: categories.map(id => ({ id }))
                    }
                }
            });
            yield db_1.db.specification.deleteMany({
                where: {
                    productId
                }
            });
            // UPDATE PRODUCT
            const product = yield db_1.db.product.update({
                where: {
                    id: productId
                },
                data: {
                    price,
                    brandId,
                    title,
                    specification: {
                        create: specification
                    },
                    overview,
                    features,
                    warranty,
                    colors,
                    instockStatus,
                    description,
                    type,
                    dealerPrice,
                    marketPrice,
                    discount,
                    status,
                    priceUnit,
                    categories: {
                        create: categories.map(id => ({
                            category: {
                                connect: { id }
                            }
                        }))
                    },
                    salesCategory: {
                        create: salesCategory.map(id => ({
                            salesCategory: {
                                connect: { id }
                            }
                        }))
                    },
                    quantity,
                }
            });
            res.status(200).json((0, helper_1.HttpDataResponse)({ product }));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.updateProductHandler = updateProductHandler;
function uploadImagesProductHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { productId } = req.params;
            const { images } = req.body;
            yield db_1.db.product.update({
                where: {
                    id: productId
                },
                data: {
                    images: {
                        push: images,
                    }
                }
            });
            res.status(200).json((0, helper_1.HttpListResponse)(images));
        }
        catch (err) {
            next(err);
        }
    });
}
exports.uploadImagesProductHandler = uploadImagesProductHandler;
