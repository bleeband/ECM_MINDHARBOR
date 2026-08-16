import type { Request, Response, NextFunction } from "express";
import { obtenirActivites } from "../services/activity.service.js";

export async function getActivities(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const activities = await obtenirActivites();

    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
}
