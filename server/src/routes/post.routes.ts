import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";
import { AppError } from "../middlewares/error.js";
import prisma from "../utils/prisma.js";

const router = Router();

const createCommentSchema = z.object({
  contenu: z.string().trim().min(1).max(5000),
});

router.post("/:id/comments", requireAuth, async (req, res, next) => {
  try {
    const postId = req.params.id;

    // sassure que le id recu est bien un string
    if (typeof postId !== "string") {
      throw new AppError(400, "INVALID_POST_ID", "Id de publication invalide.");
    }

    const result = createCommentSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, "VALIDATION_ERROR", "Commentaire invalide.");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new AppError(404, "POST_NOT_FOUND", "Publication introuvable.");
    }

    // check si le user est membre du groupe avant de commenter
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.userId,
          groupId: post.groupeId,
        },
      },
    });

    if (!membership || membership.statutDemande !== "ACCEPTEE") {
      throw new AppError(
        403,
        "GROUP_MEMBERSHIP_REQUIRED",
        "Vous devez etre membre du groupe pour commenter.",
      );
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: req.user!.userId,
        postId,
        contenu: result.data.contenu,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json(comment);
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
