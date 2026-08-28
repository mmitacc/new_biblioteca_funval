import { z } from "zod/v4";

const booleanoEstricto = z.coerce
  .string()
  .optional()
  .transform((valor) => {
    if (valor === undefined) return undefined;
    if (valor.trim().toLowerCase() === "true") return true;
    if (valor.trim().toLowerCase() === "false") return false;
  });

export const libroBodySchema = z.object({
  titulo: z
    .string({ message: "El titulo debe ser un texto" })
    .trim()
    .min(1, "El titulo es obligatorio")
    .min(3, "El titulo debe tener un minimo de 3 caracteres")
    .max(200, "El titulo no debe ser mayor a 200 caracteres"),
  autor: z
    .string({ message: "El autor debe ser un texto" })
    .trim()
    .min(1, "El autor es obligatorio")
    .min(3, "El autor debe tener un minimo de 3 caracteres")
    .max(100, "El autor no debe ser mayor a 100 caracteres"),
  categoria: z
    .string({ message: "La categoria debe ser un texto" })
    .trim()
    .min(1, "La categoria es obligatorio")
    .min(3, "La categoria debe tener un minimo de 3 caracteres")
    .max(150, "La categoria no debe ser mayor a 150 caracteres"),
  stock: z
    .number({ message: "El precio debe ser un número válido" })
    .int("El precio debe ser un número entero")
    .nonnegative("El precio no puede ser menor a cero")
    .default(0),
  disponible: booleanoEstricto,
});

export const libroQuerySchema = libroBodySchema.partial();
