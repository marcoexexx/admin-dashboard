"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingConfig = void 0;
const colorize_1 = require("./colorize");
const logging_1 = require("./logging");
exports.LoggingConfig = {
    display(message, displayLevel) {
        const date = (new Date()).toISOString();
        return `[${date} ${(0, colorize_1.colorize)(displayLevel.toUpperCase(), logging_1.level.indexOf(displayLevel))}] ${message}`;
    },
};
