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
const redis_1 = require("redis");
const getConfig_1 = __importDefault(require("./getConfig"));
const logging_1 = __importDefault(require("../middleware/logging/logging"));
const redisClient = (0, redis_1.createClient)({
    url: (0, getConfig_1.default)("redisUrl")
});
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisClient.connect();
    });
}
connectRedis();
redisClient.on("connect", () => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.log("Connected to Redis server");
    redisClient.set("try", "Hello Wellcome to Rangoon");
}));
redisClient.on("error", (err) => {
    logging_1.default.error("Failed connecting to redis:", err === null || err === void 0 ? void 0 : err.message);
    redisClient.disconnect();
    logging_1.default.warn("Redis client closed");
});
redisClient.on("end", () => {
    logging_1.default.info("Redis connection has been closed. 😢👋");
});
exports.default = redisClient;
