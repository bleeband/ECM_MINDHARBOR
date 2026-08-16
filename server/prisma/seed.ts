import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

await prisma.journalActivity.deleteMany();
await prisma.journalEntry.deleteMany();
await prisma.activity.deleteMany();

// fonction pour obtenir un chiffre aléatoire entre 1 et 5 inclusif:

function getRandomInt(min: number, max: number): number {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);
  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

// liste d'évenements pour remplir le field evenements avec un evenement aléatoire:

const evenementsListe = [
  "Allé à l'épicerie",
  "Allé au gym",
  "Téléphoné à ma grand-mère",
  "Club de course",
  "Joué avec mon chat",
  "Joué à DnD avec mes amis",
  "Marché au parc",
];

// ajout des activités

await prisma.activity.createMany({
  data: [
    { nom: "exercice" },
    { nom: "travail" },
    { nom: "méditation" },
    { nom: "loisirs" },
    { nom: "thérapie" },
    { nom: "marche" },
  ],
});

const activities = await prisma.activity.findMany();

// loop pour créer 90 journal entries avec valeurs aléatoires et dates adjacentes:

for (let i: number = 0; i < 90; i += 1) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  await prisma.journalEntry.create({
    data: {
      date: d,
      humeur: getRandomInt(1, 5),
      energie: getRandomInt(1, 5),
      qualite_sommeil: getRandomInt(1, 5),
      anxiete_stress: getRandomInt(1, 5),
      evenements: evenementsListe[getRandomInt(0, evenementsListe.length - 1)]!,
      userId: "cmsttqsje0000i4vuahfp43bh",
      activities: {
        create: [
          { activityId: activities[getRandomInt(0, activities.length - 1)]!.id },
        ],
      },
    },
  });
}

// afficher les journal entries crééés:

// console.log(await prisma.journalEntry.findMany());
