"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccessLogSchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        accessLogId: (0, zod_1.string)({ required_error: "accessLogId is required" })
    })
};
exports.deleteAccessLogSchema = (0, zod_1.object)(Object.assign({}, params));
