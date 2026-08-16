import prisma from "../utils/prisma.js";

// va chercher toutes les activites dispo
export function obtenirActivites() {
  return prisma.activity.findMany({
    orderBy: {
      nom: "asc",
    },
  });
}
