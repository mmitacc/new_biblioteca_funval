import type { Request, Response } from "express";
import { PrestamoModel } from "../models/prestamos.model.js";
import {
  createPrestamoSchema,
  updatePrestamoSchema,
} from "../schemas/prestamos.schema.js";
//get para ver toda la lista

export async function getPrestamos(req: Request, res: Response) {
  /*
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Obtener todos los préstamos y filtrar por estado de devolución'
  */
  try {
    const { devuelto } = req.query;
    if (devuelto !== undefined && devuelto !== "true" && devuelto !== "false") {
      res.status(400).json({
        error: "El parámetro devuelto debe ser true o false",
      });
      return;
    }
    const filtroDevuelto =
      devuelto === undefined ? undefined : devuelto === "true";
    const prestamos = await PrestamoModel.findAll(filtroDevuelto);
    res.json({ totalPrestamos: prestamos.length, data: prestamos });
  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);
    res.status(500).json({ error: error.message });
  }
}

//GET PARA VER UN PRESTAMOS POR SU ID
export async function getPrestamosById(req: Request, res: Response) {
  /*  
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Obtener y filtrar un registro de Prestamo de la biblioteca por su ID'
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el id debe ser numerico" });
      return;
    }
    const prestamo = await PrestamoModel.findById(id);
    if (!prestamo) {
      res.status(400).json({ error: "prestamo no encontrado" });
      return;
    }
    res.json({ data: prestamo });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//POST PARA CREAR UN PRESTAMO
export async function postPrestamo(req: Request, res: Response) {
  /*
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Crear un nuevo registro de Prestamo de la biblioteca'
  */

  try {
    const result = createPrestamoSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const newPrestamo = await PrestamoModel.create(result.data);

    res.status(201).json({ data: newPrestamo });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//put para actualizar

export async function putPrestamo(req: Request, res: Response) {
  /*
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Actualizar un registro de Prestamo de la biblioteca por su ID'
  */

  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "EL ID DEBE SER UN VALOR NUMERICO",
      });
      return;
    }

    const result = updatePrestamoSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }

    const prestamoUpdate = await PrestamoModel.update(id, result.data);

    if (!prestamoUpdate) {
      res.status(404).json({
        error: "prestamo no encontrado",
      });
      return;
    }

    res.json({ data: prestamoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// delete para eliminar

export async function deletePrestamo(req: Request, res: Response) {
  /*  
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Eliminar un registro de Prestamo de la biblioteca por su ID'
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const prestamoEliminado = await PrestamoModel.delete(id);
    if (prestamoEliminado) {
      res.status(200).json({ message: "prestamo eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "prestamo no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
