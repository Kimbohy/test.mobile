import z from "zod";

// Define individual field schemas for reuse
const emailSchema = z
  .string()
  .email("Veuillez entrer une adresse e-mail valide")
  .min(1, "L'adresse e-mail est requise");

const passwordSchema = z.string().min(1, "Le mot de passe est requis");

const newPasswordSchema = z
  .string()
  .min(6, "Le mot de passe doit comporter au moins 6 caractères")
  .max(20, "Le mot de passe ne peut pas dépasser 20 caractères");

const nameSchema = z
  .string()
  .min(2, "Le nom doit comporter au moins 2 caractères")
  .max(100, "Le nom ne peut pas dépasser 100 caractères");

// Main auth schema with all fields
export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  newPassword: newPasswordSchema.optional(),
  name: nameSchema,
});

// Specific schemas for different forms
export const signinSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const passwordChangeSchema = z.object({
  password: passwordSchema,
  newPassword: newPasswordSchema,
});

export const profileUpdateSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    newPassword: newPasswordSchema.optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    }
  );

export type AuthSchemaType = z.infer<typeof authSchema>;
export type ProfileUpdateSchemaType = z.infer<typeof profileUpdateSchema>;
