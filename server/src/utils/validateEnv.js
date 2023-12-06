"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        PORT: (0, envalid_1.port)(),
        NODE_ENV: (0, envalid_1.str)(),
        LOG_LEVEL: (0, envalid_1.str)(),
        DATABASE_URL: (0, envalid_1.str)(),
        POSTGRES_USER: (0, envalid_1.str)(),
        POSTGRES_PASSWORD: (0, envalid_1.str)(),
        POSTGRES_DB: (0, envalid_1.str)(),
        REDIS_URL: (0, envalid_1.str)(),
        JWT_ACCESS_TOKEN_PRIVATE_KEY: (0, envalid_1.str)(),
        JWT_ACCESS_TOKEN_PUBLIC_KEY: (0, envalid_1.str)(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: (0, envalid_1.str)(),
        JWT_REFRESH_TOKEN_PUBLIC_KEY: (0, envalid_1.str)(),
    });
};
exports.default = validateEnv;
