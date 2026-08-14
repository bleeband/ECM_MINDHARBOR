import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
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

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, accessSecret);

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Token invalide");
  }

  return {
    userId: decoded.userId,
    role: decoded.role,
  };
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, refreshSecret);

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Refresh token invalide");
  }

  return {
    userId: decoded.userId,
    role: decoded.role,
  };
}
