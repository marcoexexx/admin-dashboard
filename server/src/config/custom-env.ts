export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,

  postgresConfig: {
    url: process.env.DATABASE_URL
  },

  redisUrl: process.env.REDIS_URL,

  jwtConfig: {
    accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
  },

  googleOAuth: {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect: process.env.GOOGLE_OAUTH_REDIRECT
  },

  mockData: {
    authToken: process.env.AUTH_TOKEN,
    authUserToken: process.env.AUTH_USER_TOKEN,
    adminUserId: process.env.TEST_ADMIN_USER_ID,
    userId: process.env.TEST_USER_ID,
    productId: process.env.TEST_PRODUCT_ID
  },

  smtp: {
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER
  },
}
