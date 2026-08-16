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
    // prend le user connecter directement du token
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
    // transforme page et limit en skip/take pour Prisma
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

// la date vient directement de /journal/:date
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

// envoie seulement les champs a modifier au service
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
    // range peut etre 7d, 30d ou 90d
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
    // requireAuth a deja verifier le token donc req.user existe ici
    const insights = await obtenirInsightsJournal(req.user!.userId);

    res.status(200).json(insights);
  } catch (error) {
    next(error);
  }
}
