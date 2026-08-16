import { z } from "zod";

const journalBodySchema = z.object({
  // force le format de date YYYY-MM-DD
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),

  // les 4 indicateurs vont de 1 a 5
  humeur: z.number().int().min(1).max(5),

  energie: z.number().int().min(1).max(5),

  qualite_sommeil: z.number().int().min(1).max(5),

  anxiete_stress: z.number().int().min(1).max(5),

  evenements: z.string().min(1, "Les événements sont requis"),

  gratitude: z.string().optional(),

  activityIds: z.array(z.string()).optional(),
});

// pour un PATCH on peut modifier juste les champs quon veut, sauf la date
const updateJournalBodySchema = journalBodySchema
  .omit({ date: true })
  .partial();

// la date vient de /journal/:date
const dateParamsSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),
});

export const journalDateSchema = z.object({
  body: z.object({}).optional(),
  params: dateParamsSchema,
  query: z.object({}),
});

export const updateJournalSchema = z.object({
  body: updateJournalBodySchema,
  params: dateParamsSchema,
  query: z.object({}),
});

export const createJournalSchema = z.object({
  body: journalBodySchema,
  params: z.object({}),
  query: z.object({}),
});

// les stats peuvent etre sur 7, 30 ou 90 jours
const statsQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).default("30d"),
});

export const journalStatsSchema = z.object({
  // un GET a pas de body donc on le laisse optionnel
  body: z.object({}).optional(),
  params: z.object({}),
  query: statsQuerySchema,
});

export type JournalStatsQuery = z.infer<typeof statsQuerySchema>;
export type CreateJournalInput = z.infer<typeof journalBodySchema>;
export type JournalDateParams = z.infer<typeof dateParamsSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalBodySchema>;
