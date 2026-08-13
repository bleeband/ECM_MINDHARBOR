import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: number;
  role: string;
};

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

const accessSecret = getEnv("JWT_ACCESS_SECRET");
const refreshSecret = getEnv("JWT_REFRESH_SECRET");

if (!accessSecret || !refreshSecret) {
  throw new Error("Les secrets JWT sont manquants.");
}

export function createAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, accessSecret, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });
}
