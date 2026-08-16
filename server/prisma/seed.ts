import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";
import { hashPassword } from "../src/utils/password.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const demoUsers = [
  {
    email: "admin@ecmmind.com",
    username: "admin",
    password: "AdminTest-2026!",
    role: "ADMINISTRATEUR" as const,
  },
  {
    email: "moderateur@ecmmind.com",
    username: "moderateur",
    password: "ModTest-2026!",
    role: "MODERATEUR" as const,
  },
  {
    email: "user1@test.com",
    username: "user1",
    password: "User1Test-2026!",
    role: "UTILISATEUR" as const,
  },
  {
    email: "user2@test.com",
    username: "user2",
    password: "User2Test-2026!",
    role: "UTILISATEUR" as const,
  },
];

const activityNames = [
  "exercice",
  "travail",
  "méditation",
  "loisirs",
  "thérapie",
  "marche",
];

const events = [
  "Allé à l'épicerie",
  "Allé au gym",
  "Téléphoné à ma grand-mère",
  "Club de course",
  "Joué avec mon chat",
  "Joué à DnD avec mes amis",
  "Marché au parc",
];

const dailyScores = [
  [4, 3, 4, 2],
  [3, 4, 3, 3],
  [5, 4, 4, 1],
  [3, 2, 3, 4],
  [4, 4, 5, 2],
] as const;

function todayInQuebec() {
  const date = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return new Date(`${date}T00:00:00.000Z`);
}

try {
  const seededUsers = await Promise.all(
    demoUsers.map(async (user) => {
      const motdepasse = await hashPassword(user.password);

      return prisma.user.upsert({
        where: { email: user.email },
        update: {
          username: user.username,
          motdepasse,
          role: user.role,
        },
        create: {
          email: user.email,
          username: user.username,
          motdepasse,
          role: user.role,
        },
      });
    }),
  );

  const user1 = seededUsers.find((user) => user.email === "user1@test.com");

  if (!user1) {
    throw new Error("Le compte de démonstration user1 est introuvable.");
  }

  const activities = await Promise.all(
    activityNames.map((nom) =>
      prisma.activity.upsert({
        where: { nom },
        update: {},
        create: { nom },
      }),
    ),
  );

  // Le seed ne réinitialise que les entrées de démonstration de user1.
  await prisma.journalEntry.deleteMany({ where: { userId: user1.id } });

  const today = todayInQuebec();

  for (let index = 0; index < 30; index += 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - index);

    const [humeur, energie, qualite_sommeil, anxiete_stress] =
      dailyScores[index % dailyScores.length]!;

    await prisma.journalEntry.create({
      data: {
        userId: user1.id,
        date,
        humeur,
        energie,
        qualite_sommeil,
        anxiete_stress,
        evenements: events[index % events.length]!,
        activities: {
          create: {
            activityId: activities[index % activities.length]!.id,
          },
        },
      },
    });
  }

  console.log("Seed de démonstration complété: 4 utilisateurs et 30 entrées pour user1.");
} finally {
  await prisma.$disconnect();
}
