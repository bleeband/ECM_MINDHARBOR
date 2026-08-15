import prisma from "../utils/prisma.js";
import { AppError } from "../middlewares/error.js";
import type { RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword } from "../utils/password.js";

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

// supprimer le token de la BD
export function supprimerRefreshToken(token: string) {
  return prisma.refreshToken.deleteMany({
    where: {
      token,
    },
  });
}
