import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role, StatutDemande, TypeResource, Visibilite } from "../generated/prisma/client.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est manquante.");
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

type SeedResource = {
  type: TypeResource;
  titre: string;
  url?: string;
  contenu: string;
};

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

async function upsertResource(resource: SeedResource) {
  const existing = await prisma.resource.findFirst({
    where: { titre: resource.titre },
  });

  if (existing) {
    return prisma.resource.update({
      where: { id: existing.id },
      data: resource,
    });
  }

  return prisma.resource.create({
    data: resource,
  });
}

async function upsertGroup(nom: string, description: string) {
  const existing = await prisma.group.findFirst({
    where: { nom },
  });

  if (existing) {
    return prisma.group.update({
      where: { id: existing.id },
      data: { description },
    });
  }

  return prisma.group.create({
    data: { nom, description },
  });
}

async function upsertPost(input: { authorId: string; groupeId: string; titre: string; contenu: string; visibilite: Visibilite }) {
  const existing = await prisma.post.findFirst({
    where: {
      authorId: input.authorId,
      groupeId: input.groupeId,
      titre: input.titre,
    },
  });

  if (existing) {
    return prisma.post.update({
      where: { id: existing.id },
      data: {
        contenu: input.contenu,
        visibilite: input.visibilite,
      },
    });
  }

  return prisma.post.create({
    data: input,
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("Demo2026", 10);

  // Utilisateurs : mots de passe de démo = Demo2026
  const users = [
    {
      username: "admin_mindharbor",
      email: "admin@mindharbor.demo",
      role: Role.ADMINISTRATEUR,
    },
    {
      username: "moderateur_mh",
      email: "moderateur@mindharbor.demo",
      role: Role.MODERATEUR,
    },
    {
      username: "clara_demo",
      email: "clara@mindharbor.demo",
      role: Role.UTILISATEUR,
    },
    {
      username: "leo_demo",
      email: "leo@mindharbor.demo",
      role: Role.UTILISATEUR,
    },
    {
      username: "visiteur_demo",
      email: "visiteur@mindharbor.demo",
      role: Role.VISITEUR,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        role: user.role,
      },
      create: {
        ...user,
        motdepasse: passwordHash,
      },
    });
  }

  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: "admin@mindharbor.demo" },
  });

  const moderateur = await prisma.user.findUniqueOrThrow({
    where: { email: "moderateur@mindharbor.demo" },
  });

  const clara = await prisma.user.findUniqueOrThrow({
    where: { email: "clara@mindharbor.demo" },
  });

  const leo = await prisma.user.findUniqueOrThrow({
    where: { email: "leo@mindharbor.demo" },
  });

  // Activités
  const activityNames = ["Méditation", "Marche", "Respiration guidée", "Lecture", "Yoga doux", "Écriture"];

  for (const nom of activityNames) {
    await prisma.activity.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }

  const meditation = await prisma.activity.findUniqueOrThrow({
    where: { nom: "Méditation" },
  });

  const marche = await prisma.activity.findUniqueOrThrow({
    where: { nom: "Marche" },
  });

  const respiration = await prisma.activity.findUniqueOrThrow({
    where: { nom: "Respiration guidée" },
  });

  // Ressources
  const resources = await Promise.all([
    upsertResource({
      type: TypeResource.EXERCICE,
      titre: "Respiration 4-7-8",
      url: "https://www.quebec.ca/sante/sante-mentale",
      contenu: "Un exercice court pour ralentir la respiration et prendre une pause.",
    }),
    upsertResource({
      type: TypeResource.ARTICLE,
      titre: "Comprendre le stress",
      url: "https://www.quebec.ca/sante/sante-mentale",
      contenu: "Quelques repères simples pour reconnaître le stress et choisir une ressource appropriée.",
    }),
    upsertResource({
      type: TypeResource.FICHE_PRATIQUE,
      titre: "Préparer une meilleure nuit",
      contenu: "Une liste d'habitudes simples pour favoriser un sommeil plus reposant.",
    }),
    upsertResource({
      type: TypeResource.EXERCICE,
      titre: "Faire une courte marche",
      contenu: "Sortir quelques minutes peut aider à bouger, respirer et changer de rythme.",
    }),
  ]);

  // Favoris : relation User <-> Resource
  await prisma.favorite.upsert({
    where: {
      userId_resourceId: {
        userId: clara.id,
        resourceId: resources[0]!.id,
      },
    },
    update: {},
    create: {
      userId: clara.id,
      resourceId: resources[0]!.id,
    },
  });

  await prisma.favorite.upsert({
    where: {
      userId_resourceId: {
        userId: leo.id,
        resourceId: resources[1]!.id,
      },
    },
    update: {},
    create: {
      userId: leo.id,
      resourceId: resources[1]!.id,
    },
  });

  // 12 journaux : données suffisantes pour statistiques et insight méditation.
  for (let index = 0; index < 12; index += 1) {
    const meditationDay = index % 2 === 0;
    const activity = meditationDay ? meditation : index % 3 === 0 ? marche : respiration;

    const date = daysAgo(index);

    await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId: clara.id,
          date,
        },
      },
      update: {
        humeur: meditationDay ? 4 : 3,
        energie: meditationDay ? 4 : 3,
        qualite_sommeil: meditationDay ? 4 : 3,
        anxiete_stress: meditationDay ? 2 : 4,
        evenements: meditationDay ? "J'ai pris un moment pour moi aujourd'hui." : "Journée plus chargée que prévu.",
        gratitude: meditationDay ? "Je suis reconnaissante d'avoir pris une pause." : "Je suis reconnaissante pour le soutien de mes proches.",
        activities: {
          deleteMany: {},
          create: [
            {
              activity: {
                connect: { id: activity.id },
              },
            },
          ],
        },
      },
      create: {
        userId: clara.id,
        date,
        humeur: meditationDay ? 4 : 3,
        energie: meditationDay ? 4 : 3,
        qualite_sommeil: meditationDay ? 4 : 3,
        anxiete_stress: meditationDay ? 2 : 4,
        evenements: meditationDay ? "J'ai pris un moment pour moi aujourd'hui." : "Journée plus chargée que prévu.",
        gratitude: meditationDay ? "Je suis reconnaissante d'avoir pris une pause." : "Je suis reconnaissante pour le soutien de mes proches.",
        activities: {
          create: [
            {
              activity: {
                connect: { id: activity.id },
              },
            },
          ],
        },
      },
    });
  }

  // Groupes
  const anxieteGroup = await upsertGroup("Mieux vivre avec l'anxiété", "Un espace respectueux pour partager des stratégies et s'encourager.");

  const sommeilGroup = await upsertGroup("Sommeil et récupération", "Un groupe pour échanger sur le repos, les routines et la récupération.");

  // Membres des groupes
  const memberships = [
    {
      userId: moderateur.id,
      groupId: anxieteGroup.id,
      statutDemande: StatutDemande.ACCEPTEE,
    },
    {
      userId: clara.id,
      groupId: anxieteGroup.id,
      statutDemande: StatutDemande.ACCEPTEE,
    },
    {
      userId: leo.id,
      groupId: anxieteGroup.id,
      statutDemande: StatutDemande.ACCEPTEE,
    },
    {
      userId: clara.id,
      groupId: sommeilGroup.id,
      statutDemande: StatutDemande.EN_ATTENTE,
    },
  ];

  for (const membership of memberships) {
    await prisma.groupMember.upsert({
      where: {
        userId_groupId: {
          userId: membership.userId,
          groupId: membership.groupId,
        },
      },
      update: {
        statutDemande: membership.statutDemande,
      },
      create: membership,
    });
  }

  // Publications
  const post = await upsertPost({
    authorId: clara.id,
    groupeId: anxieteGroup.id,
    titre: "Une petite victoire aujourd'hui",
    contenu: "J'ai pris dix minutes pour respirer avant une situation stressante. Ça m'a aidée à ralentir.",
    visibilite: Visibilite.PUBLIQUE,
  });

  await upsertPost({
    authorId: leo.id,
    groupeId: anxieteGroup.id,
    titre: "Merci pour vos conseils",
    contenu: "Vos messages m'ont aidé à essayer une nouvelle routine cette semaine.",
    visibilite: Visibilite.PUBLIQUE,
  });

  // Commentaire
  const comment = await prisma.comment.findFirst({
    where: {
      authorId: leo.id,
      postId: post.id,
      contenu: "Bravo Clara, merci de partager ton expérience.",
    },
  });

  if (comment) {
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        contenu: "Bravo Clara, merci de partager ton expérience.",
      },
    });
  } else {
    await prisma.comment.create({
      data: {
        authorId: leo.id,
        postId: post.id,
        contenu: "Bravo Clara, merci de partager ton expérience.",
      },
    });
  }

  // Message privé
  const message = await prisma.message.findFirst({
    where: {
      senderId: clara.id,
      recipientId: leo.id,
      titre: "Merci",
    },
  });

  if (message) {
    await prisma.message.update({
      where: { id: message.id },
      data: {
        contenu: "Merci pour ton message dans le groupe. Ça m'a fait du bien.",
      },
    });
  } else {
    await prisma.message.create({
      data: {
        senderId: clara.id,
        recipientId: leo.id,
        titre: "Merci",
        contenu: "Merci pour ton message dans le groupe. Ça m'a fait du bien.",
      },
    });
  }

  // Signalement
  const report = await prisma.report.findFirst({
    where: {
      emetteurId: leo.id,
      reportedUserId: clara.id,
      postId: post.id,
      contenu: "Signalement de démonstration pour tester l'administration.",
    },
  });

  if (!report) {
    await prisma.report.create({
      data: {
        emetteurId: leo.id,
        reportedUserId: clara.id,
        postId: post.id,
        contenu: "Signalement de démonstration pour tester l'administration.",
      },
    });
  }

  // RefreshToken : démo seulement, pas un vrai JWT de session.
  await prisma.refreshToken.upsert({
    where: {
      token: "seed-refresh-token-mindharbor-demo",
    },
    update: {
      userId: clara.id,
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    },
    create: {
      token: "seed-refresh-token-mindharbor-demo",
      userId: clara.id,
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    },
  });

  console.info("Seed MindHarbor terminé.");
  console.info("Compte admin : admin@mindharbor.demo / Demo2026");
  console.info("Compte utilisateur : clara@mindharbor.demo / Demo2026");
}

main()
  .catch((error: unknown) => {
    console.error("Erreur durant le seed :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
