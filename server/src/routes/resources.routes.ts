import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";
import { buildMeta, parsePagination } from "../utils/paginate.js";

const router = Router();
const typeResourceSchema = z.enum(["ARTICLE", "EXERCICE", "FICHE_PRATIQUE"]);

function parseResourceId(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    throw new AppError(400, "INVALID_RESOURCE_ID", "Identifiant de ressource invalide.");
  }

  return value;
}

function parseType(value: unknown) {
  if (value === undefined || value === "") return undefined;

  const result = typeResourceSchema.safeParse(value);
  if (!result.success) {
    throw new AppError(400, "INVALID_RESOURCE_TYPE", "Type de ressource invalide.");
  }

  return result.data;
}

router.get("/me/favorites", requireAuth, async (req, res, next) => {
  try {
    const { page, limit, skip, take } = parsePagination(req.query);
    const where = { userId: req.user!.userId };
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        include: { resource: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.favorite.count({ where }),
    ]);

    res.json({
      data: favorites.map(({ resource }) => ({ ...resource, isFavorite: true })),
      meta: buildMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { page, limit, skip, take } = parsePagination(req.query);
    const q = String(req.query.q ?? "").trim();
    const type = parseType(req.query.type);
    const where = {
      ...(type ? { type } : {}),
      ...(q
        ? {
            OR: [
              { titre: { contains: q, mode: "insensitive" as const } },
              { contenu: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [data, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          favorites: {
            where: { userId: req.user?.userId ?? "" },
            select: { userId: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.resource.count({ where }),
    ]);

    res.json({
      data: data.map(({ favorites, ...resource }) => ({
        ...resource,
        isFavorite: favorites.length > 0,
      })),
      meta: buildMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/favorite", requireAuth, async (req, res, next) => {
  try {
    const resourceId = parseResourceId(req.params.id);
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true },
    });

    if (!resource) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Ressource introuvable.");
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_resourceId: {
          userId: req.user!.userId,
          resourceId: resource.id,
        },
      },
      create: {
        userId: req.user!.userId,
        resourceId: resource.id,
      },
      update: {},
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/favorite", requireAuth, async (req, res, next) => {
  try {
    const resourceId = parseResourceId(req.params.id);
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.userId,
        resourceId,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
