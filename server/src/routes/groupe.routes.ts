import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";
import { buildMeta, parsePagination } from "../utils/paginate.js";

const router = Router();

const createPostSchema = z.object({
  titre: z.string().trim().min(1).max(255),
  contenu: z.string().trim().min(1).max(10_000),
  visibilite: z.enum(["PUBLIQUE", "PRIVE"]).optional(),
});

const createGroupSchema = z.object({
  nom: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(1000),
});

function parseGroupId(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(
      400,
      "INVALID_GROUP_ID",
      "Identifiant de groupe invalide.",
    );
  }

  return value;
}

function validatePost(body: unknown) {
  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Publication invalide.",
      result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
}

async function ensureGroupExists(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new AppError(404, "GROUP_NOT_FOUND", "Groupe introuvable.");
  }

  return group;
}

router.get("/", async (req, res, next) => {
  try {
    const { page, limit, skip, take } = parsePagination(req.query);
    const q = String(req.query.q ?? "").trim();
    const where =
      q ?
        {
          OR: [
            { nom: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};
    const [data, total] = await Promise.all([
      prisma.group.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.group.count({ where }),
    ]);

    res.json({ data, meta: buildMeta(page, limit, total) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);
    const group = await ensureGroupExists(groupId);

    let membership = null;

    if (req.user) {
      membership = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: req.user.userId,
            groupId,
          },
        },
      });
    }

    res.json({
      ...group,

      // aide le frontend a savoir quel bouton afficher
      isMember: membership?.statutDemande === "ACCEPTEE",
      isOwner: group.creatorId === req.user?.userId,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/join", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);
    await ensureGroupExists(groupId);

    const membership = await prisma.groupMember.upsert({
      where: {
        userId_groupId: {
          userId: req.user!.userId,
          groupId,
        },
      },
      create: {
        userId: req.user!.userId,
        groupId,
        statutDemande: "ACCEPTEE",
      },
      update: {},
    });

    res.status(201).json(membership);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const result = createGroupSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, "VALIDATION_ERROR", "Groupe invalide.");
    }

    // cree le groupe
    const group = await prisma.group.create({
      data: {
        nom: result.data.nom,
        description: result.data.description,

        creatorId: req.user!.userId,

        // le createur est membre direct de son groupe
        groupMembers: {
          create: {
            userId: req.user!.userId,
            statutDemande: "ACCEPTEE",
          },
        },
      },
    });

    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/leave", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);

    await ensureGroupExists(groupId);

    // enleve juste le user connecter des membres
    await prisma.groupMember.deleteMany({
      where: {
        groupId,
        userId: req.user!.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);
    const group = await ensureGroupExists(groupId);

    // juste le createur peut supprimer son groupe
    if (group.creatorId !== req.user!.userId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Vous ne pouvez pas supprimer ce groupe.",
      );
    }

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);
    await ensureGroupExists(groupId);
    const { page, limit, skip, take } = parsePagination(req.query);
    const where = { groupeId: groupId };
    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true },
          },

          // ramene aussi les commentaires avec chaque post
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({ data, meta: buildMeta(page, limit, total) });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/posts", requireAuth, async (req, res, next) => {
  try {
    const groupId = parseGroupId(req.params.id);
    await ensureGroupExists(groupId);
    const input = validatePost(req.body);
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.userId,
          groupId,
        },
      },
      select: { statutDemande: true },
    });

    if (!membership || membership.statutDemande !== "ACCEPTEE") {
      throw new AppError(
        403,
        "GROUP_MEMBERSHIP_REQUIRED",
        "Vous devez être membre accepté du groupe pour publier.",
      );
    }

    const post = await prisma.post.create({
      data: {
        authorId: req.user!.userId,
        groupeId: groupId,
        titre: input.titre,
        contenu: input.contenu,
        visibilite: input.visibilite ?? "PUBLIQUE",
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const postId = req.params.id;

    // sassure que le id est bien valide
    if (typeof postId !== "string") {
      throw new AppError(400, "INVALID_POST_ID", "Id de publication invalide.");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new AppError(404, "POST_NOT_FOUND", "Publication introuvable.");
    }

    // un user peut supprimer juste ses propres posts
    if (post.authorId !== req.user!.userId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Vous ne pouvez pas supprimer cette publication.",
      );
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
