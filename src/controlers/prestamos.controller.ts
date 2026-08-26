import type { Request, Response } from "express";
import { PrestamoModel } from "../models/prestamos.model.js";

//get para ver toda la lista
export async function getPrestamos(req: Request, res: Response) {
  /*  
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Obtener y filtrar todos los registros de Prestamos de la biblioteca'
  */  
  try {
    const prestamos = await PrestamoModel.findAll();
    res.json({ totalPrestamos: prestamos.length, data: prestamos });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectarse a la base de datos",
    });
  }
}

// get para filtrar por true o false
export async function getPrestamosByDevuelto(req: Request, res: Response) {
  /*  
  #swagger.tags = ['Prestamo']
  #swagger.summary = 'Obtener y filtrar los registros de Prestamos DEVUELTOS de la biblioteca'
  */    
  try {
    const { devuelto } = req.query;
    if (devuelto !== "true" && devuelto !== "false") {
      res
        .status(400)
        .json({ error: "El parámetro devuelto debe ser true o false" });
      return;
    }
    const prestamos = await PrestamoModel.findAllByDevuelto(
      devuelto === "true",
    );
    res.json({ totalPrestamos: prestamos.length, data: prestamos });
  } catch (error: any) {
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
    const { fecha_prestamo, fecha_devolucion, devuelto, id_socio, id_libro } =
      req.body;
    if (!fecha_prestamo || devuelto === undefined || !id_socio || !id_libro) {
      res.status(400).json({ error: "faltan datos obligatorios" });
    }
    const newPrestamo = await PrestamoModel.create({
      fecha_prestamo,
      fecha_devolucion,
      devuelto,
      id_socio,
      id_libro,
    });
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
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const prestamoUpdate = await PrestamoModel.update(id, { devuelto: true });
    if (!prestamoUpdate) {
      res.status(404).json({ error: "prestamo no encontrado" });
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
