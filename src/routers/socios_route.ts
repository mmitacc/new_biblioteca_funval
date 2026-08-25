import { Router } from "express";
import { getsocios, getsociobyid, newsocio, updatesocio, deletesocio } from "../controlers/socio.controller.js"


const router = Router();

router.get("/", getsocios)
router.get("/:id", getsociobyid)
router.post("/", newsocio)
router.put("/:id", updatesocio)
router.delete("/:id", deletesocio)


export default router; 
