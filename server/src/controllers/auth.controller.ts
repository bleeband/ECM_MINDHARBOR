import type { Request, Response } from "express";

export function register(req: Request, res: Response) {
  res.status(200).json({
    message: "Données d'inscription valides",
  });
}

export function login(req: Request, res: Response) {
  res.status(200).json({
    message: "Données de connexion valides",
  });
}