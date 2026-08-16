import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";
import { buildMeta, parsePagination } from "../utils/paginate.js";

const router = Router();

const createPostSchema = z.object({
  titre: z.string().trim().min(1).max(255),
  contenu: z.string().trim().min(1).max(10_000),
  visibilite: z.enum(["PUBLIQUE", "PRIVE"]).optional(),
});

function parseGroupId(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(400, "INVALID_GROUP_ID", "Identifiant de groupe invalide.");
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
    const where = q
      ? {
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

router.get("/:id", async (req, res, next) => {
  try {
    const group = await ensureGroupExists(parseGroupId(req.params.id));
    res.json(group);
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

export default router;
