import { z } from "zod";

export const createPrestamoSchema = z.object({
  fecha_prestamo: z
    .string({ message: "La fecha de prestamo debe ser obligatorio" })
    .min(1, "La fecha de prestamo debe tener mas de 1 caracter")
    .trim(),
  fecha_devolucion: z.string().nullable(),
  devuelto: z.boolean({ message: "El campo devuelto debe ser boolean" }),
  id_socio: z
    .number({ message: "El id del socio debe ser obligatorio" })
    .positive("El id del socio debe ser mayor a 0"),
  id_libro: z
    .number({ message: "El id del libro debe ser obligatorio" })
    .positive("El id del libro debe ser mayor a 0"),
});
export const updatePrestamoSchema = z.object({
  devuelto: z.boolean({ message: "El campo devuelto debe ser obligatorio" }),
});
