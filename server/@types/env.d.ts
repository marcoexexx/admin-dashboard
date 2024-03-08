namespace NodeJS {
  interface ProcessEnv {
    HTTPS: "true" | "false",

    HOST: string,
    PORT: number,
    NODE_ENV: "production" | "development" | "test",
    LOG_LEVEL: "log" | "info" | "debug" | "warn" | "error",
    ORIGIN: string,
    WEBSITE_ORIGIN: string,

    DATABASE_URL: string,
    REDIS_URL: string,

    JWT_ACCESS_TOKEN_PRIVATE_KEY: string,
    JWT_ACCESS_TOKEN_PUBLIC_KEY: string,
    JWT_REFRESH_TOKEN_PRIVATE_KEY: string,
    JWT_REFRESH_TOKEN_PUBLIC_KEY: string,

    GOOGLE_OAUTH_CLIENT_ID: string,
    GOOGLE_OAUTH_CLIENT_SECRET: string,
    GOOGLE_OAUTH_REDIRECT: string,

    AUTH_TOKEN: string,
    AUTH_USER_TOKEN: string,
    TEST_ADMIN_USER_ID: string,
    TEST_USER_ID: string,
    TEST_PRODUCT_ID: string

    EMAIL_USER: string,
    EMAIL_PASS: string,
    EMAIL_HOST: stirng,
    EMAIL_PORT: number
  }
}
