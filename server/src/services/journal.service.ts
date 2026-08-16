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

export async function obtenirStatsJournal(
  userId: string,
  range: "7d" | "30d" | "90d",
) {
  const jours = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  }[range];

  const aujourdHui = obtenirDateAujourdhui();

  const dateDebut = new Date(`${aujourdHui}T00:00:00.000Z`);

  dateDebut.setUTCDate(dateDebut.getUTCDate() - (jours - 1));

  const stats = await prisma.journalEntry.groupBy({
    by: ["date"],

    where: {
      userId,
      date: {
        gte: dateDebut,
      },
    },

    _avg: {
      humeur: true,
      energie: true,
      qualite_sommeil: true,
      anxiete_stress: true,
    },

    orderBy: {
      date: "asc",
    },
  });

  return {
    series: stats.map((stat) => ({
      date: stat.date,
      humeur: stat._avg.humeur ?? 0,
      energie: stat._avg.energie ?? 0,
      qualite_sommeil: stat._avg.qualite_sommeil ?? 0,
      anxiete_stress: stat._avg.anxiete_stress ?? 0,
    })),
  };
}

export async function obtenirInsightsJournal(userId: string) {
  const activities = await prisma.activity.findMany({
    select: {
      id: true,
      nom: true,
    },
  });

  const observations: string[] = [];
  const correlations: string[] = [];

  for (const activity of activities) {
    const avecActivite = await prisma.journalEntry.aggregate({
      where: {
        userId,
        activities: {
          some: {
            activityId: activity.id,
          },
        },
      },
      _avg: {
        anxiete_stress: true,
      },
      _count: {
        id: true,
      },
    });

    const sansActivite = await prisma.journalEntry.aggregate({
      where: {
        userId,
        activities: {
          none: {
            activityId: activity.id,
          },
        },
      },
      _avg: {
        anxiete_stress: true,
      },
      _count: {
        id: true,
      },
    });

    if (
      avecActivite._count.id >= 5 &&
      sansActivite._count.id >= 5 &&
      avecActivite._avg.anxiete_stress !== null &&
      sansActivite._avg.anxiete_stress !== null
    ) {
      const avec = avecActivite._avg.anxiete_stress;
      const sans = sansActivite._avg.anxiete_stress;

      const difference = Math.round(((sans - avec) / sans) * 100);

      if (difference >= 10) {
        correlations.push(
          `Les jours avec l'activité ${activity.nom}, votre anxiété est en moyenne ${difference} % plus basse.`,
        );
      }
    }
  }

  if (correlations.length > 0) {
    observations.push(correlations[0]!);
  }

  const moyenneGenerale = await prisma.journalEntry.aggregate({
    where: {
      userId,
    },
    _avg: {
      humeur: true,
      energie: true,
      qualite_sommeil: true,
      anxiete_stress: true,
    },
    _count: {
      id: true,
    },
  });

  if (moyenneGenerale._count.id >= 5) {
    const sommeil = moyenneGenerale._avg.qualite_sommeil;
    const anxiete = moyenneGenerale._avg.anxiete_stress;

    if (sommeil !== null && sommeil < 3) {
      observations.push(
        "Votre qualité de sommeil moyenne est sous 3 sur 5 sur la période observée.",
      );
    }

    if (anxiete !== null && anxiete >= 4) {
      observations.push(
        "Votre niveau d'anxiété moyen est élevé dans vos entrées récentes.",
      );
    }
  }

  return {
    observations,
    correlations,
  };
}
