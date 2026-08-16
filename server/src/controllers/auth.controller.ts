import type { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.js";
import type {
  LoginInput,
  RefreshInput,
  RegisterInput,
} from "../schemas/auth.schema.js";
import { createAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";
import {
  connecterUtilisateur,
  inscrireUtilisateur,
  supprimerRefreshToken,
  trouverRefreshToken,
} from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const utilisateur = await inscrireUtilisateur(req.body as RegisterInput);
    res.status(201).json({ user: utilisateur });
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

    res.status(200).json({ accessToken });
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

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshInput;
    await supprimerRefreshToken(refreshToken, req.user!.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError(401, "UNAUTHENTICATED", "Utilisateur introuvable.");
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
