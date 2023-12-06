"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToBoolean = void 0;
const isObject_1 = __importDefault(require("lodash/isObject"));
const mapValues_1 = __importDefault(require("lodash/mapValues"));
function convertStringToBoolean(value) {
    if (value === "true") {
        return true;
    }
    else if (value === "false") {
        return false;
    }
    else if ((0, isObject_1.default)(value)) {
        return (0, mapValues_1.default)(value, convertStringToBoolean);
    }
    else {
        return value;
    }
}
exports.convertStringToBoolean = convertStringToBoolean;
