import prisma from "../utils/prisma.js";
import { AppError } from "../middlewares/error.js";
import type { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";
import type { LoginInput } from "../schemas/auth.schema.js";
import { comparePassword } from "../utils/password.js";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiration,
} from "../utils/jwt.js";

export async function inscrireUtilisateur(data: RegisterInput) {
  const utilisateurExistant = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.pseudonyme }],
    },
  });

  if (utilisateurExistant) {
    throw new AppError(
      409,
      "USER_ALREADY_EXISTS",
      "Ce courriel ou ce pseudonyme est déjà utilisé.",
    );
  }

  const motdepasse = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      username: data.pseudonyme,
      motdepasse,
      role: "UTILISATEUR",
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
}

export async function connecterUtilisateur(data: LoginInput) {
  const utilisateur = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!utilisateur) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Courriel ou mot de passe invalide.",
    );
  }

  const motdepasseValide = await comparePassword(
    data.password,
    utilisateur.motdepasse,
  );

  if (!motdepasseValide) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Courriel ou mot de passe invalide.",
    );
  }

  const payload = {
    userId: utilisateur.id,
    role: utilisateur.role,
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  await sauvegarderRefreshToken(
    utilisateur.id,
    refreshToken,
    getRefreshTokenExpiration(),
  );

  return {
    user: {
      id: utilisateur.id,
      username: utilisateur.username,
      email: utilisateur.email,
      role: utilisateur.role,
    },
    accessToken,
    refreshToken,
  };
}

// sauvegarder l'expiration du token pour le gerer facilement sans dependre du JWT
export function sauvegarderRefreshToken(
  userId: string,
  token: string,
  expiresAt: Date,
) {
  // cree une donnee dans la table refreshtoken
  return prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

// supprimer le token de la BD avec check que sa vien du bon user
export function supprimerRefreshToken(token: string, userId: string) {
  return prisma.refreshToken.deleteMany({
    where: {
      token,
      userId,
    },
  });
}
// trouver le token dans la BD
export function trouverRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
  });
}
