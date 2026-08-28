import { Router } from "express";
import {
  getLibrosAll,
  getLibroId,
  postLibro,
  putLibroId,
  deleteLibroId,
} from "../controlers/libro.controller.js";
import idParamSchema from "../schemas/idParamSchema.js";
import {
  validarBodySchema,
  validarParamSchema,
} from "../middlewares/libro.middleware.js";
import { libroBodySchema, libroQuerySchema } from "../schemas/libro.shema.js";

const router: Router = Router();

/* el metodo get libros para todos los registros  */
router.get("/", getLibrosAll);

/* el metodo get libros por el id  */
router.get("/:id", validarParamSchema(idParamSchema), getLibroId);

/* el metodo post libros para registrar un nuevo libro */
router.post("/", validarBodySchema(libroBodySchema), postLibro);

/* el metodo put libros por el id  */
router.put(
  "/:id",
  validarParamSchema(idParamSchema),
  validarBodySchema(libroQuerySchema),
  putLibroId,
);

/* el metodo delete libros por el id  */
router.delete("/:id", validarParamSchema(idParamSchema), deleteLibroId);

export default router;
