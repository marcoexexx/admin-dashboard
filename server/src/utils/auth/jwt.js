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
exports.signToken = exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getConfig_1 = __importDefault(require("../getConfig"));
const connectRedis_1 = __importDefault(require("../connectRedis"));
function signJwt(payload, keyName, options) {
    const key = (0, getConfig_1.default)("jwtConfig")[keyName];
    if (!key)
        throw new Error("The process environment (process.env) is undefined. Ensure that it is properly configured.");
    const privateKey = Buffer.from(key, "base64").toString("utf8");
    return jsonwebtoken_1.default.sign(payload, privateKey, Object.assign(Object.assign({}, options), { algorithm: "RS256" }));
}
exports.signJwt = signJwt;
function verifyJwt(token, keyName) {
    try {
        const key = (0, getConfig_1.default)("jwtConfig")[keyName];
        if (!key)
            return null;
        const publicKey = Buffer.from(key, "base64").toString("utf8");
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return decoded;
    }
    catch (_) {
        return null;
    }
}
exports.verifyJwt = verifyJwt;
function signToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const redisCacheExpiresIn = (0, getConfig_1.default)("redisCacheExpiresIn") || 3600;
        const accessTokenExpiresIn = (0, getConfig_1.default)("accessTokenExpiresIn") || 900;
        const refreshTokenExpiresIn = (0, getConfig_1.default)("refreshTokenExpiresIn") || 3600;
        connectRedis_1.default.set(user.id, JSON.stringify(user), {
            EX: redisCacheExpiresIn
        });
        const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
            expiresIn: `${accessTokenExpiresIn}s`,
        });
        const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
            expiresIn: `${refreshTokenExpiresIn}s`,
        });
        return { accessToken, refreshToken };
    });
}
exports.signToken = signToken;
