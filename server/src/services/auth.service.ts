import prisma from "../utils/prisma.js";

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
