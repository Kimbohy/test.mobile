import z from "zod";
import { Category } from "@/types/product.type";

// Define individual field schemas for reuse
const nameSchema = z.string().min(1, "Le nom du produit est requis");

const descriptionSchema = z.string().optional();

const priceSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), "Le prix doit être un nombre valide")
  .refine((val) => Number(val) >= 0, "Le prix doit être positif");

const stockSchema = z
  .string()
  .refine((val) => !isNaN(Number(val)), "Le stock doit être un nombre valide")
  .refine(
    (val) => Number(val) >= 0,
    "Le stock doit être un nombre entier positif"
  );

const categorySchema = z.nativeEnum(Category, {
  errorMap: () => ({ message: "Veuillez sélectionner une catégorie valide" }),
});

const vendeursSchema = z.string().min(1, "Le nom du vendeur est requis");

const imageSchema = z.string().optional();

// Main product schema
export const productSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  price: priceSchema,
  stock: stockSchema,
  category: categorySchema,
  vendeurs: vendeursSchema,
  image: imageSchema,
});

export type ProductSchemaType = z.infer<typeof productSchema>;
