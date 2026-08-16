import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import prisma from "../utils/prisma.js";

const router = Router();

function startOfTodayUtc() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const today = startOfTodayUtc();
    const weekStart = new Date(today);
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);

    const [user, todayJournal, weeklyJournal, suggestion] = await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: req.user!.userId },
        select: { username: true },
      }),
      prisma.journalEntry.findUnique({
        where: {
          userId_date: {
            userId: req.user!.userId,
            date: today,
          },
        },
        select: { id: true },
      }),
      prisma.journalEntry.aggregate({
        where: {
          userId: req.user!.userId,
          date: { gte: weekStart, lte: today },
        },
        _count: { id: true },
        _avg: {
          humeur: true,
          energie: true,
          qualite_sommeil: true,
          anxiete_stress: true,
        },
      }),
      prisma.resource.findFirst({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      username: user.username,
      journalCompleted: Boolean(todayJournal),
      week: {
        entryCount: weeklyJournal._count.id,
        humeur: weeklyJournal._avg.humeur,
        energie: weeklyJournal._avg.energie,
        qualite_sommeil: weeklyJournal._avg.qualite_sommeil,
        anxiete_stress: weeklyJournal._avg.anxiete_stress,
      },
      suggestion,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
