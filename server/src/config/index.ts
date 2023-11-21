export * from './custom-env'

export default {
  origin: "http://localhost:5173",

  accessTokenExpiresIn: 60 * 60 * 1,        //  1 hour: in seconds
  refreshTokenExpiresIn: 60 * 60 * 24 * 7,  //  in seconds
  redisCacheExpiresIn: 60 * 60 * 24 * 7,    //  in seconds
}
