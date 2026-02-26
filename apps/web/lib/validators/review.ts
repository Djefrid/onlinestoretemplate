import { z } from "zod";

export const reviewSchema = z.object({
  product_slug: z.string().min(1),
  author_name: z.string().min(2, "Le nom doit faire au moins 2 caractères").max(60),
  author_email: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  rating: z.number().int().min(1, "Sélectionnez au moins 1 étoile").max(5),
  comment: z
    .string()
    .min(10, "Le commentaire doit faire au moins 10 caractères")
    .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
