import jwt, { SignOptions } from "jsonwebtoken";
import redisClient from "../connectRedis";
import getConfig, { Config } from "../getConfig";

export function signJwt<T extends { sub: string; }>(
  payload: T,
  keyName: keyof Pick<Config["jwtConfig"], "accessTokenPrivateKey" | "refreshTokenPrivateKey">,
  options: SignOptions,
): string {
  const key = getConfig("jwtConfig")[keyName];

  if (!key) {
    throw new Error(
      "The process environment (process.env) is undefined. Ensure that it is properly configured.",
    );
  }

  const privateKey = Buffer.from(key, "base64").toString("utf8");
  return jwt.sign(payload, privateKey, { ...options, algorithm: "RS256" });
}

export function verifyJwt<T extends { sub: string; }>(
  token: string,
  keyName: keyof Pick<Config["jwtConfig"], "accessTokenPublicKey" | "refreshTokenPublicKey">,
): T | null {
  try {
    const key = getConfig("jwtConfig")[keyName];

    if (!key) return null;

    const publicKey = Buffer.from(key, "base64").toString("utf8");
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (_) {
    return null;
  }
}

export async function signToken<T extends { id: string; }>(user: T) {
  const redisCacheExpiresIn = getConfig("redisCacheExpiresIn") || 3600;
  const accessTokenExpiresIn = getConfig("accessTokenExpiresIn") || 900;
  const refreshTokenExpiresIn = getConfig("refreshTokenExpiresIn") || 3600;

  redisClient.set(user.id, JSON.stringify(user), {
    EX: redisCacheExpiresIn,
  });

  const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${accessTokenExpiresIn}s`,
  });

  const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${refreshTokenExpiresIn}s`,
  });

  return { accessToken, refreshToken };
}
