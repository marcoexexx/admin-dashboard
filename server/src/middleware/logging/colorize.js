"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = void 0;
const lodash_1 = require("lodash");
//             ["error",      "warn",       "debug",      "info",       "log"]
const colors = ["\x1b[1;31m", "\x1b[0;33m", "\x1b[0;34m", "\x1b[0;36m", "\x1b[1m"];
const is_unix = (0, lodash_1.memoize)(() => {
    return process.platform === "linux" || process.platform === "darwin";
});
function colorize(txt, level) {
    if (is_unix()) {
        const color = colors[level];
        const offset = "\x1b[0m";
        return `${color}${txt}${offset}`;
    }
    return String(txt);
}
exports.colorize = colorize;
