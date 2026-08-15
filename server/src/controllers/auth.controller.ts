import type { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.js";
import type {
  LoginInput,
  RefreshInput,
  RegisterInput,
} from "../schemas/auth.schema.js";
import { createAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import {
  connecterUtilisateur,
  inscrireUtilisateur,
  trouverRefreshToken,
} from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const utilisateur = await inscrireUtilisateur(req.body as RegisterInput);

    res.status(201).json({
      user: utilisateur,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const resultat = await connecterUtilisateur(req.body as LoginInput);

    res.status(200).json(resultat);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshInput;

    const payload = verifyRefreshToken(refreshToken);

    const tokenEnregistre = await trouverRefreshToken(refreshToken);

    if (!tokenEnregistre) {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Refresh token invalide ou expiré.",
      );
    }

    const accessToken = createAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(
      new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Refresh token invalide ou expiré.",
      ),
    );
  }
}

export function logout(req: Request, res: Response) {
  res.status(200).json({
    message: "Données de logout valides",
  });
}

export function me(req: Request, res: Response) {
  res.status(200).json({
    user: req.user,
  });
}
