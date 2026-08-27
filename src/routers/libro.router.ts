import { Router } from "express";
import {
  getLibrosAll,
  getLibroId,
  postLibro,
  putLibroId,
  deleteLibroId,
} from "../controlers/libro.controller.js";

const router: Router = Router();

/* el metodo get libros para todos los registros  */
router.get("/", getLibrosAll);

/* el metodo get libros por el id  */
router.get("/:id", getLibroId);

/* el metodo post libros para registrar un nuevo libro */
router.post("/", postLibro);

/* el metodo put libros por el id  */
router.put("/:id", putLibroId);

/* el metodo delete libros por el id  */
router.delete("/:id", deleteLibroId);

export default router;
