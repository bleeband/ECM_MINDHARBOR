import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";
import { buildMeta, parsePagination } from "../utils/paginate.js";

const router = Router();
const resourceSchema = z.object({
  type: z.enum(["ARTICLE", "EXERCICE", "FICHE_PRATIQUE"]),
  titre: z.string().trim().min(1).max(255),
  url: z.string().url().optional().or(z.literal("")),
  contenu: z.string().trim().min(1).max(20_000),
});
const groupSchema = z.object({
  nom: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(5000),
});

function validateBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Données invalides.",
      result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
}

router.use(requireAuth, requireRole("MODERATEUR", "ADMINISTRATEUR"));

router.get("/stats", async (_req, res, next) => {
  try {
    const [users, journalEntries, groups, reports, resources] = await Promise.all([
      prisma.user.count(),
      prisma.journalEntry.count(),
      prisma.group.count(),
      prisma.report.count(),
      prisma.resource.count(),
    ]);

    res.json({ users, journalEntries, groups, reports, resources });
  } catch (error) {
    next(error);
  }
});

router.get("/reports", async (req, res, next) => {
  try {
    const { page, limit, skip, take } = parsePagination(req.query);
    const [data, total] = await Promise.all([
      prisma.report.findMany({
        include: {
          emetteur: { select: { id: true, username: true } },
          reported: { select: { id: true, username: true } },
          post: { select: { id: true, titre: true } },
          comment: { select: { id: true, contenu: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.report.count(),
    ]);

    res.json({ data, meta: buildMeta(page, limit, total) });
  } catch (error) {
    next(error);
  }
});

router.post("/resources", async (req, res, next) => {
  try {
    const input = validateBody(resourceSchema, req.body);
    const resource = await prisma.resource.create({
      data: {
        type: input.type,
        titre: input.titre,
        url: input.url || null,
        contenu: input.contenu,
      },
    });

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
});

router.patch("/resources/:id", async (req, res, next) => {
  try {
    const input = validateBody(resourceSchema.partial(), req.body);

    if (Object.keys(input).length === 0) {
      throw new AppError(400, "VALIDATION_ERROR", "Aucun champ à modifier.");
    }

    const resource = await prisma.resource.update({
      where: { id: req.params.id },
      data: {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.titre !== undefined ? { titre: input.titre } : {}),
        ...(input.url !== undefined ? { url: input.url || null } : {}),
        ...(input.contenu !== undefined ? { contenu: input.contenu } : {}),
      },
    });

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

router.delete("/resources/:id", async (req, res, next) => {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/groups", async (req, res, next) => {
  try {
    const input = validateBody(groupSchema, req.body);
    const group = await prisma.group.create({ data: input });
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

export default router;
