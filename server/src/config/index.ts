export * from './custom-env'

export default {
  appName: "Admin Dashboard" as const,
  emailFrom: "toyko2001@gmail.com" as const,

  hideBanner: false,

  accessTokenExpiresIn: 60 * 60 * 1,        //  1 hour: in seconds
  refreshTokenExpiresIn: 60 * 60 * 24 * 7,  //  in seconds
  redisCacheExpiresIn: 60 * 60 * 24 * 7,    //  in seconds

  dbProvider: "mongodb" as "mongodb" | "postgresql"
}
