"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.uploadImagesProductSchema = exports.createMultiProductsSchema = exports.createProductSchema = exports.getProductSchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        productId: (0, zod_1.string)()
    })
};
exports.getProductSchema = (0, zod_1.object)(Object.assign({}, params));
exports.createProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        price: (0, zod_1.number)({ required_error: "Price is required " }),
        brandId: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        title: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        specification: (0, zod_1.object)({
            name: (0, zod_1.string)({ required_error: "Specification name is required" }),
            value: (0, zod_1.string)({ required_error: "Specification value is required" }),
        }).array(),
        overview: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        features: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        warranty: (0, zod_1.number)({ required_error: "Price is required " }),
        categories: (0, zod_1.string)().array().default([]),
        colors: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        instockStatus: zod_1.z.enum(["InStock", "OutOfStock", "AskForStock"]),
        description: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        type: zod_1.z.enum(["Switch", "Accessory", "Router", "Wifi"]),
        dealerPrice: (0, zod_1.number)().min(0),
        marketPrice: (0, zod_1.number)().min(0),
        discount: (0, zod_1.number)().min(0),
        priceUnit: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        salesCategory: (0, zod_1.string)().array(),
        quantity: (0, zod_1.number)().min(0),
        status: zod_1.z.enum(["Draft", "Pending", "Published"]).default("Draft")
    })
});
exports.createMultiProductsSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        price: (0, zod_1.number)({ required_error: "Price is required " }),
        brandId: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        title: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        specification: (0, zod_1.object)({
            name: (0, zod_1.string)({ required_error: "Specification name is required" }),
            value: (0, zod_1.string)({ required_error: "Specification value is required" }),
        }).array(),
        overview: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        features: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        warranty: (0, zod_1.number)({ required_error: "Price is required " }),
        categories: (0, zod_1.string)().array().default([]),
        colors: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        instockStatus: zod_1.z.enum(["InStock", "OutOfStock", "AskForStock"]),
        description: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        type: zod_1.z.enum(["Switch", "Accessory", "Router", "Wifi"]),
        dealerPrice: (0, zod_1.number)().min(0),
        marketPrice: (0, zod_1.number)().min(0),
        discount: (0, zod_1.number)().min(0),
        priceUnit: zod_1.z.enum(["MMK", "USD"]),
        salesCategory: (0, zod_1.string)().array(),
        quantity: (0, zod_1.number)().min(0),
        status: zod_1.z.enum(["Draft", "Pending", "Published"]).default("Draft")
    }).array()
});
exports.uploadImagesProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        images: (0, zod_1.string)().array(),
    })
});
exports.updateProductSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        price: (0, zod_1.number)({ required_error: "Price is required " }),
        brandId: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        title: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        specification: (0, zod_1.object)({
            name: (0, zod_1.string)({ required_error: "Specification name is required" }),
            value: (0, zod_1.string)({ required_error: "Specification value is required" }),
        }).array(),
        overview: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        features: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        warranty: (0, zod_1.number)({ required_error: "Price is required " }),
        categories: (0, zod_1.string)().array().default([]),
        colors: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(128),
        instockStatus: zod_1.z.enum(["InStock", "OutOfStock", "AskForStock"]),
        description: (0, zod_1.string)({ required_error: "Brand is required" })
            .min(2).max(5000),
        type: zod_1.z.enum(["Switch", "Accessory", "Router", "Wifi"]),
        dealerPrice: (0, zod_1.number)().min(0),
        marketPrice: (0, zod_1.number)().min(0),
        discount: (0, zod_1.number)().min(0),
        priceUnit: zod_1.z.enum(["MMK", "USD"]),
        salesCategory: (0, zod_1.string)().array(),
        quantity: (0, zod_1.number)().min(0),
        status: zod_1.z.enum(["Draft", "Pending", "Published"]).default("Draft")
    }) }));
