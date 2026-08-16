import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";

const router = Router();

const reportSchema = z
  .object({
    reportedUserId: z.string().min(1).optional(),
    postId: z.string().min(1).optional(),
    commentId: z.string().min(1).optional(),
    contenu: z.string().trim().min(1).max(5000),
  })
  .refine(
    (input) =>
      [input.reportedUserId, input.postId, input.commentId].filter(Boolean)
        .length === 1,
    {
      message: "Un signalement doit viser exactement un utilisateur, une publication ou un commentaire.",
    },
  );

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = reportSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Signalement invalide.",
        parsed.error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        })),
      );
    }

    const report = await prisma.report.create({
      data: {
        emetteurId: req.user!.userId,
        reportedUserId: parsed.data.reportedUserId ?? null,
        postId: parsed.data.postId ?? null,
        commentId: parsed.data.commentId ?? null,
        contenu: parsed.data.contenu,
      },
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
