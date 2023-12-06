"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = exports.level = exports.currentLevel = void 0;
const getConfig_1 = __importDefault(require("../../utils/getConfig"));
const config_1 = require("./config");
exports.currentLevel = (0, getConfig_1.default)("logLevel") || "info";
exports.level = ["error", "warn", "debug", "info", "log"];
const logging = {
    log: (message, ...opt) => 4 <= exports.level.indexOf(exports.currentLevel)
        ? console.log(config_1.LoggingConfig.display(message, exports.level[4]), ...opt)
        : undefined,
    info: (message, ...opt) => 3 <= exports.level.indexOf(exports.currentLevel)
        ? console.info(config_1.LoggingConfig.display(message, exports.level[3]), ...opt)
        : undefined,
    debug: (message, ...opt) => 2 <= exports.level.indexOf(exports.currentLevel)
        ? console.debug(config_1.LoggingConfig.display(message, exports.level[2]), ...opt)
        : undefined,
    warn: (message, ...opt) => 1 <= exports.level.indexOf(exports.currentLevel)
        ? console.warn(config_1.LoggingConfig.display(message, exports.level[1]), ...opt)
        : undefined,
    error: (message, ...opt) => 0 <= exports.level.indexOf(exports.currentLevel)
        ? console.error(config_1.LoggingConfig.display(message, exports.level[0]), ...opt)
        : undefined,
};
function loggingMiddleware(req, res, next) {
    const startTime = new Date();
    const { method, url } = req;
    // Capture the response finish event
    res.on("finish", () => {
        const endTime = new Date();
        const durstion = endTime.getTime() - startTime.getTime();
        logging.info(`${method} ${res.statusCode} ${durstion}ms`);
    });
    // // Capture errors
    // res.on("error", (err) => {
    //   logging.error("Error occurred for ${method} ${url}:", err.message)
    // });
    // Capture the response close event
    res.on('close', () => {
        logging.info(`Response closed for ${method} ${url}`);
    });
    next();
}
exports.loggingMiddleware = loggingMiddleware;
exports.default = logging;
