"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNumericStrings = void 0;
const lodash_1 = __importDefault(require("lodash"));
const convertNumericStrings = (obj) => {
    return lodash_1.default.mapValues(obj, (value) => {
        if (lodash_1.default.isObject(value)) {
            return (0, exports.convertNumericStrings)(value); // Recursively convert nested objects
        }
        else if (lodash_1.default.isString(value) && lodash_1.default.isNumber(lodash_1.default.toNumber(value))) {
            const result = lodash_1.default.toNumber(value);
            return Number.isNaN(result) ? value : lodash_1.default.toNumber(value); // Convert numeric strings to numbers
        }
        else {
            return value;
        }
    });
};
exports.convertNumericStrings = convertNumericStrings;
