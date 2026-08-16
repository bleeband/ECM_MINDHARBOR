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

  // check si ya deja une entree pour ce user a cette date
  const entreeExistante = await prisma.journalEntry.findUnique({
    where: {
      // userId + date pour que sa sois unique, chaque user peut avoir juste une entree par jour
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
      // Prisma veut null si gratitude est pas remplie et pas undefined
      gratitude: data.gratitude ?? null,

      // cree les liens avec les activites choisi
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
  // va chercher la page demander + le total dentree
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

// cherche avec le userId aussi pour pas aller chercher le journal dun autre user
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

export async function modifierEntreeJournal(
  userId: string,
  dateString: string,
  data: UpdateJournalInput,
) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  // on peut modifier une entree seulement la journee meme
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

    // ajoute seulement les champs qui ont vraiment ete envoyer
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
        // remplace les anciennes activites par les nouvelles choisi
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

// prend la date du Quebec au lieu de UTC
function obtenirDateAujourdhui() {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

type MoyenneJourSemaine = {
  jour: number;
  humeur: number;
  energie: number;
  qualite_sommeil: number;
  anxiete_stress: number;
  total: number;
};

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

  // recule la date selon le range choisi 7, 30 ou 90 jours
  dateDebut.setUTCDate(dateDebut.getUTCDate() - (jours - 1));

  // calcule les moyennes par jour directement dans la BD
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

  // calcule les moyennes pour chaque jour de la semaine
  // les ::float et ::int convertissent les valeurs SQL en nombres JS simples
  const moyennesParJour = await prisma.$queryRaw<MoyenneJourSemaine[]>`
    SELECT
      EXTRACT(ISODOW FROM "date")::int AS "jour",
      AVG("humeur")::float AS "humeur",
      AVG("energie")::float AS "energie",
      AVG("qualite_sommeil")::float AS "qualite_sommeil",
      AVG("anxiete_stress")::float AS "anxiete_stress",
      COUNT(*)::int AS "total"
    FROM "JournalEntry"
    WHERE "userId" = ${userId}
      AND "date" >= ${dateDebut}
      -- isodow transforme une date en 1=lundi 2=mardi ect..
    GROUP BY EXTRACT(ISODOW FROM "date")
    ORDER BY "jour"
  `;

  return {
    series: stats.map((stat) => ({
      date: stat.date,
      humeur: stat._avg.humeur ?? 0,
      energie: stat._avg.energie ?? 0,
      qualite_sommeil: stat._avg.qualite_sommeil ?? 0,
      anxiete_stress: stat._avg.anxiete_stress ?? 0,
    })),

    moyennesParJour,
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

  // compare lanxiete avec et sans chaque activite
  for (const activity of activities) {
    const avecActivite = await prisma.journalEntry.aggregate({
      where: {
        userId,
        activities: {
          // some = entree avec lactivite, none = entree sans lactivite
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
          // some = entree avec lactivite, none = entree sans lactivite
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

    // faut au moins 5 entree de chaque cote avant de tirer une conclusion
    if (
      avecActivite._count.id >= 5 &&
      sansActivite._count.id >= 5 &&
      avecActivite._avg.anxiete_stress !== null &&
      sansActivite._avg.anxiete_stress !== null
    ) {
      const avec = avecActivite._avg.anxiete_stress;
      const sans = sansActivite._avg.anxiete_stress;

      // calcule le pourcentage de difference avec et sans lactivite
      const difference = Math.round(((sans - avec) / sans) * 100);

      // affiche une correlation seulement si la difference est assez importante
      if (difference >= 10) {
        correlations.push(
          `Les jours avec l'activité ${activity.nom}, votre anxiété est en moyenne ${difference} % plus basse.`,
        );
      }
    }
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

  // garde juste les jours de semaine qui ont au moins 5 entree au total
  const moyennesParJour = await prisma.$queryRaw<MoyenneJourSemaine[]>`
    SELECT
      EXTRACT(ISODOW FROM "date")::int AS "jour",
      AVG("humeur")::float AS "humeur",
      AVG("energie")::float AS "energie",
      AVG("qualite_sommeil")::float AS "qualite_sommeil",
      AVG("anxiete_stress")::float AS "anxiete_stress",
      COUNT(*)::int AS "total"
    FROM "JournalEntry"
    WHERE "userId" = ${userId}
    GROUP BY EXTRACT(ISODOW FROM "date")
    HAVING COUNT(*) >= 5
    ORDER BY "jour"
  `;

  const nomsJours = [
    "",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  // trouve le jour avec lhumeur la plus basse et lanxiete la plus haute
  if (moyennesParJour.length > 0) {
    const humeurPlusBasse = moyennesParJour.reduce((plusBasse, jour) =>
      jour.humeur < plusBasse.humeur ? jour : plusBasse,
    );

    const anxietePlusElevee = moyennesParJour.reduce((plusElevee, jour) =>
      jour.anxiete_stress > plusElevee.anxiete_stress ? jour : plusElevee,
    );

    observations.push(
      `Votre humeur moyenne est la plus basse le ${nomsJours[humeurPlusBasse.jour]} (${humeurPlusBasse.humeur.toFixed(1)}/5).`,
    );

    observations.push(
      `Votre niveau d'anxiété moyen est le plus élevé le ${nomsJours[anxietePlusElevee.jour]} (${anxietePlusElevee.anxiete_stress.toFixed(1)}/5).`,
    );
  }

  return {
    observations,
    correlations,
  };
}
