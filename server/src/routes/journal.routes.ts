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

// faut etre connecter pour creer une entree de journal
router.post("/", requireAuth, validate(createJournalSchema), createJournal);
router.get("/", requireAuth, getJournal);
// faut mettre stats et insights avant /:date sinon Express pense que stats est une date
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
// la date a modifier vient dans l'url avec /:date
router.patch(
  "/:date",
  requireAuth,
  validate(updateJournalSchema),
  updateJournal,
);

export default router;
