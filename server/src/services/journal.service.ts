import prisma from "../utils/prisma.js";
import { AppError } from "../middlewares/error.js";
import type {
  CreateJournalInput,
  UpdateJournalInput,
} from "../schemas/journal.schema.js";

export async function creerEntreeJournal(
  userId: string,
  data: CreateJournalInput,
) {
  const date = new Date(`${data.date}T00:00:00.000Z`);

  const entreeExistante = await prisma.journalEntry.findUnique({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
  });

  if (entreeExistante) {
    throw new AppError(
      409,
      "JOURNAL_ALREADY_EXISTS",
      "Une entrée existe déjà pour cette date.",
    );
  }

  return prisma.journalEntry.create({
    data: {
      userId,
      date,
      humeur: data.humeur,
      energie: data.energie,
      qualite_sommeil: data.qualite_sommeil,
      anxiete_stress: data.anxiete_stress,
      evenements: data.evenements,
      gratitude: data.gratitude ?? null,

      activities: {
        create: (data.activityIds ?? []).map((activityId) => ({
          activityId,
        })),
      },
    },

    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });
}

export async function obtenirJournal(
  userId: string,
  skip: number,
  take: number,
) {
  const [entries, total] = await prisma.$transaction([
    prisma.journalEntry.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take,
      include: {
        activities: {
          include: {
            activity: true,
          },
        },
      },
    }),

    prisma.journalEntry.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    entries,
    total,
  };
}

export async function obtenirEntreeParDate(userId: string, dateString: string) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  const entree = await prisma.journalEntry.findUnique({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });

  if (!entree) {
    throw new AppError(
      404,
      "JOURNAL_NOT_FOUND",
      "Aucune entrée trouvée pour cette date.",
    );
  }

  return entree;
}

export async function getTrends(userId: string) {
  return {
    message: "fonctionalité en construction",
    userId,
  };
}

export async function modifierEntreeJournal(
  userId: string,
  dateString: string,
  data: UpdateJournalInput,
) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (dateString !== obtenirDateAujourdhui()) {
    throw new AppError(
      403,
      "JOURNAL_EDIT_EXPIRED",
      "Cette entrée ne peut plus être modifiée.",
    );
  }

  const entreeExistante = await prisma.journalEntry.findUnique({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
  });

  if (!entreeExistante) {
    throw new AppError(
      404,
      "JOURNAL_NOT_FOUND",
      "Aucune entrée trouvée pour cette date.",
    );
  }

  return prisma.journalEntry.update({
    where: {
      userId_date: {
        userId,
        date,
      },
    },

    data: {
      ...(data.humeur !== undefined && {
        humeur: data.humeur,
      }),

      ...(data.energie !== undefined && {
        energie: data.energie,
      }),

      ...(data.qualite_sommeil !== undefined && {
        qualite_sommeil: data.qualite_sommeil,
      }),

      ...(data.anxiete_stress !== undefined && {
        anxiete_stress: data.anxiete_stress,
      }),

      ...(data.evenements !== undefined && {
        evenements: data.evenements,
      }),

      ...(data.gratitude !== undefined && {
        gratitude: data.gratitude,
      }),

      ...(data.activityIds !== undefined && {
        activities: {
          deleteMany: {},
          create: data.activityIds.map((activityId) => ({
            activityId,
          })),
        },
      }),
    },

    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });
}

function obtenirDateAujourdhui() {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
