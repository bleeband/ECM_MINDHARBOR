import prisma from "../utils/prisma.js";

export function obtenirActivites() {
  return prisma.activity.findMany({
    orderBy: {
      nom: "asc",
    },
  });
}