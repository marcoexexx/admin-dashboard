"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeSchema = exports.createMultiExchangesSchema = exports.updateExchangeSchema = exports.createExchangeSchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        exchangeId: (0, zod_1.string)({ required_error: "exchangeId is required" })
    })
};
exports.createExchangeSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        from: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        to: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        rate: (0, zod_1.number)({ required_error: "rate is required" })
            .min(0),
        date: (0, zod_1.string)({ required_error: "Date field is required" })
    })
});
exports.updateExchangeSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        from: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        to: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        rate: (0, zod_1.number)({ required_error: "rate is required" })
            .min(0),
        date: (0, zod_1.string)({ required_error: "Date field is required" })
    }) }));
exports.createMultiExchangesSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        from: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        to: zod_1.z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
        rate: (0, zod_1.number)({ required_error: "rate is required" })
            .min(0),
        date: (0, zod_1.string)({ required_error: "Date field is required" })
    }).array()
});
exports.getExchangeSchema = (0, zod_1.object)(Object.assign({}, params));
