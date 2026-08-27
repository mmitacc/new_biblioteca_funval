import { Router } from "express";
import {
  getPrestamos,
  getPrestamosById,
  postPrestamo,
  putPrestamo,
  deletePrestamo,
} from "../controlers/prestamos.controller.js";

const router = Router();
/* el metodo get prestamos para todos los registros  */
router.get("/", getPrestamos);
/* el metodo get prestamos por el id  */
router.get("/:id", getPrestamosById);
/* el metodo post prestamos para registrar un nuevo prestamo */
router.post("/", postPrestamo);
/* el metodo put prestamo por el id  */
router.put("/:id", putPrestamo);
/* el metodo delete prestamo por el id  */
router.delete("/:id", deletePrestamo);

export default router;
