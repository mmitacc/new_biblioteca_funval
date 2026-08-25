import { Router } from "express";
import {
  getPrestamos,
  getPrestamosById,
  postPrestamo,
  putPrestamo,
  deletePrestamo,
} from "../controlers/prestamos.controller.js";

const router = Router();
router.get("/", getPrestamos);
router.get("/:id", getPrestamosById);
router.post("/", postPrestamo);
router.put("/:id", putPrestamo);
router.delete("/:id", deletePrestamo);

export default router;
