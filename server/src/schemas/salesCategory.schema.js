"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalesCategorySchema = exports.getSalesCategorySchema = exports.createMultiSalesCategoriesSchema = exports.createSalesCategorySchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        salesCategoryId: (0, zod_1.string)({ required_error: "Category Id is required" })
    })
};
exports.createSalesCategorySchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Category name is required" })
    })
});
exports.createMultiSalesCategoriesSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Category name is required" })
    }).array()
});
exports.getSalesCategorySchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateSalesCategorySchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Category name is required" })
    }) }));
