import type { Request, Response } from "express";
import LibroModel from "../models/libro.model.js";

export const getLibrosAll = async (req: Request, res: Response) => {
    /*  
    #swagger.tags = ['Libro']
    #swagger.summary = 'Obtener y filtrar todos los Libros de la biblioteca'
    */
    try {
        const result = await LibroModel.findAll();
        res.json({
            message: "Conexion exitosa a la base de datos :D",
            total: result.length,
            data: result,
        });
    } catch (error) {
        console.error("error al consultar PostgreSQL: ");
        res.status(500).json({
            message: "error al intentar conectar a la base de datos :c",
        });
    }
};

export const getLibroId = async (req: Request, res: Response) => {
    /*  
    #swagger.tags = ['Libro']
    #swagger.summary = 'Obtener y filtrar un Libros de la biblioteca por su ID'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const result = await LibroModel.findLibroId(id);
        if (!result) {
            res.status(404).json({ error: "Libro no encontrado" });
            return;
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const postLibro = async (req: Request, res: Response) => {
    /*  
    #swagger.tags = ['Libro']
    #swagger.summary = 'Crea un nuevo Libro de la biblioteca'
    */    
    try {
        const { titulo, autor, categoria, stock, disponible } = req.body;
        if (!titulo || !autor || !categoria || !stock || !disponible) {
            res.status(400).json({ error: "faltan datos obligatorios" });
        }
        const result = await LibroModel.createLibro(req.body);
        if (result) {
            res.status(201).json({ message: 'Nuevo libro registrado correctamente,' });
        } else {
            res.status(404).json({ message: 'No se pudo registrar el libro nuevo,' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const putLibroId = async (req: Request, res: Response) => {
    /*  
    #swagger.tags = ['Libro']
    #swagger.summary = 'Modificar/actualizar un Libro de la biblioteca por su ID'
    */    
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const { titulo, autor, categoria, stock, disponible } = req.body;
        if (!titulo || !autor || !categoria || !stock || !disponible) {
            res.status(400).json({ error: "faltan datos obligatorios" });
        }
        const result = await LibroModel.updateLibroId(id, req.body);
        if (!result) {
            res.status(404).json({ message: 'No se pudo actualizar el libro,' });
        }
        res.status(202).json({ 'Se actualizaron los datos': result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteLibroId = async (req: Request, res: Response) => {
    /*  
    #swagger.tags = ['Libro']
    #swagger.summary = 'Elimina un registro de un Libro de la biblioteca por su ID'
    */    
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const listPrestamoIndexados = await LibroModel.getPrestamo_idLibro(id);
        if (listPrestamoIndexados.length !== 0) {
            res.status(404).json({ 'No se puede eliminar, esta indexado a prestamos': listPrestamoIndexados });
            return;
        }
        const result = await LibroModel.delLibroId(id);
        if (result) {
            res.status(201).json({ message: 'El Libro fue eliminado satisfactoriamente,' });
        } else {
            res.status(404).json({ message: 'No se pudo eliminar el libro,' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};