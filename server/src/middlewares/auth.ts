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
