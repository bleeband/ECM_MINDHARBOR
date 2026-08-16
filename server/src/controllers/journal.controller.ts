import type { Request, Response, NextFunction } from "express";
import type {
  CreateJournalInput,
  JournalDateParams,
  UpdateJournalInput,
  JournalStatsQuery,
} from "../schemas/journal.schema.js";
import {
  creerEntreeJournal,
  obtenirJournal,
  obtenirEntreeParDate,
  modifierEntreeJournal,
  obtenirStatsJournal,
  obtenirInsightsJournal,
} from "../services/journal.service.js";
import { parsePagination, buildMeta } from "../utils/paginate.js";

export async function createJournal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const entree = await creerEntreeJournal(
      req.user!.userId,
      req.body as CreateJournalInput,
    );

    res.status(201).json(entree);
  } catch (error) {
    next(error);
  }
}

export async function getJournal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { page, limit, skip, take } = parsePagination(req.query);

    const { entries, total } = await obtenirJournal(
      req.user!.userId,
      skip,
      take,
    );

    res.status(200).json({
      data: entries,
      meta: buildMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
}

export async function getJournalByDate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { date } = req.params as JournalDateParams;

    const entree = await obtenirEntreeParDate(req.user!.userId, date);

    res.status(200).json(entree);
  } catch (error) {
    next(error);
  }
}

export async function updateJournal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { date } = req.params as JournalDateParams;

    const entree = await modifierEntreeJournal(
      req.user!.userId,
      date,
      req.body as UpdateJournalInput,
    );

    res.status(200).json(entree);
  } catch (error) {
    next(error);
  }
}

export async function getJournalStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { range } = req.query as unknown as JournalStatsQuery;

    const stats = await obtenirStatsJournal(req.user!.userId, range);

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getJournalInsights(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const insights = await obtenirInsightsJournal(req.user!.userId);

    res.status(200).json(insights);
  } catch (error) {
    next(error);
  }
}
