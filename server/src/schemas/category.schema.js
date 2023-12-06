"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.getCategorySchema = exports.createMultiCategoriesSchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        categoryId: (0, zod_1.string)({ required_error: "Category Id is required" })
    })
};
exports.createCategorySchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Category name is required" })
    })
});
exports.createMultiCategoriesSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Category name is required" })
    }).array()
});
exports.getCategorySchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateCategorySchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Name is required" })
            .min(0).max(128)
    }) }));
