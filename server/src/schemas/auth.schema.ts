import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
  .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre");

const registerBodySchema = z.object({
  email: z.string().email("Format de courriel invalide"),
  password: passwordSchema,
  pseudonyme: z
    .string()
    .min(2, "Le pseudonyme doit contenir au moins 2 caracteres")
    .max(50, "Le pseudonyme est trop long"),
});


export const registerSchema = z.object({
  body: registerBodySchema,
  params: z.object({}),
  query: z.object({}),
});

const loginBodySchema = z.object({
  email: z.string().email("Format de courriel invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const loginSchema = z.object({
  body: loginBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;