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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpDataResponse = exports.HttpListResponse = exports.HttpResponse = exports.mayError = void 0;
/**
 * Error Test
 */
function mayError() {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.reject(new Error("Failed: this is error message from mayError"));
    });
}
exports.mayError = mayError;
function HttpResponse(status, message, error) {
    return { status, message, error };
}
exports.HttpResponse = HttpResponse;
function HttpListResponse(results, count = results.length) {
    return { status: 200, results, count, error: undefined };
}
exports.HttpListResponse = HttpListResponse;
function HttpDataResponse(result) {
    return Object.assign({ status: 200, error: undefined }, result);
}
exports.HttpDataResponse = HttpDataResponse;
