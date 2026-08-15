import type { RequestHandler } from "express";
import { AppError } from "./error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError(401, "UNAUTHENTICATED", "Token manquant."));
  }
  

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return next(
      new AppError(401, "INVALID_TOKEN", "Format du token invalide."),
    );
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "INVALID_TOKEN", "Token invalide ou expiré."));
  }
};

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    next();
    return;
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    next(new AppError(401, "INVALID_TOKEN", "Format du token invalide."));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "INVALID_TOKEN", "Token invalide ou expiré."));
  }
};

// accepte 1 ou plusieurs roles en parametre
export function requireRole(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          401,
          "UNAUTHENTICATED",
          "Authentification requise."
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "FORBIDDEN",
          "Vous n'avez pas les permissions nécessaires."
        )
      );
    }

    next();
  };
}
