import { cleanEnv, port, str } from "envalid"


const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str(),
    LOG_LEVEL: str(),

    DATABASE_URL: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),

    REDIS_URL: str(),

    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),
  })
}

export default validateEnv;
