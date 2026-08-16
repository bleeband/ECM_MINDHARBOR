import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createJournal,
  getJournal,
  getJournalByDate,
  updateJournal,
  getJournalStats,
  getJournalInsights,
} from "../controllers/journal.controller.js";

import {
  createJournalSchema,
  journalDateSchema,
  updateJournalSchema,
  journalStatsSchema,
} from "../schemas/journal.schema.js";

const router = Router();

router.post("/", requireAuth, validate(createJournalSchema), createJournal);
router.get("/", requireAuth, getJournal);
router.get(
  "/stats",
  requireAuth,
  validate(journalStatsSchema),
  getJournalStats,
);
router.get("/insights", requireAuth, getJournalInsights);
router.get(
  "/:date",
  requireAuth,
  validate(journalDateSchema),
  getJournalByDate,
);
router.patch(
  "/:date",
  requireAuth,
  validate(updateJournalSchema),
  updateJournal,
);

export default router;
