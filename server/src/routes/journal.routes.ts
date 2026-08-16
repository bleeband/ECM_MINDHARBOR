import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createJournal,
  getJournal,
  getJournalByDate,
  updateJournal,
} from "../controllers/journal.controller.js";

import {
  createJournalSchema,
  journalDateSchema,
  updateJournalSchema,
} from "../schemas/journal.schema.js";

const router = Router();

router.post("/", requireAuth, validate(createJournalSchema), createJournal);
router.get("/", requireAuth, getJournal);
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
