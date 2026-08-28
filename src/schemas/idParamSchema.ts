import { z } from "zod";

const idParamSchema = z.object({
  id: z.coerce
    .number({ message: "El ID debe ser un número válido" })
    .nonnegative("El ID debe ser un número mayor a cero")
    .int("El ID debe ser un número entero"),
});

export default idParamSchema;
