"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrandSchema = exports.getBrandSchema = exports.createMultiBrandsSchema = exports.createBrandSchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        brandId: (0, zod_1.string)({ required_error: "brandId is required" })
    })
};
exports.createBrandSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Name is required" })
            .min(1).max(128)
    })
});
exports.createMultiBrandsSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Name is required" })
            .min(1).max(128)
    }).array()
});
exports.getBrandSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateBrandSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Name is required" })
            .min(0).max(128)
    }) }));
