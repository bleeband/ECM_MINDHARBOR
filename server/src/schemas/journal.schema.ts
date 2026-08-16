import { z } from "zod";

const journalBodySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD"),

  humeur: z.number().int().min(1).max(5),

  energie: z.number().int().min(1).max(5),

  qualite_sommeil: z.number().int().min(1).max(5),

  anxiete_stress: z.number().int().min(1).max(5),

  evenements: z.string().min(1, "Les événements sont requis"),

  gratitude: z.string().optional(),

  activityIds: z.array(z.string()).optional(),
});

const updateJournalBodySchema = journalBodySchema
  .omit({ date: true })
  .partial();

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

export type CreateJournalInput = z.infer<typeof journalBodySchema>;
export type JournalDateParams = z.infer<typeof dateParamsSchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalBodySchema>;
