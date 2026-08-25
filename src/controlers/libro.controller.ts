import type { Request, Response } from "express";
import { pool } from "../config/db.js";

export const getLibrosAll = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM libro;");
        res.json({
            message: "Conexion exitosa a la base de datos :D",
            total: result.rowCount,
            data: result.rows,
        });
    } catch (error) {
        console.error("error al consultar PostgreSQL: ");
        res.status(500).json({
            message: "error al intentar conectar a la base de datos :c",
        });
    }
};

export const getLibroId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const resu = await pool.query("SELECT * FROM libro WHERE id_libro =$1", [id]);
        if (resu.rows.length === 0) {
            res.status(404).json({ error: "Libro no encontrado" });
            return;
        }
        res.json(resu.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const postLibro = async (req: Request, res: Response) => {
    try {
        const { titulo, autor, categoria, stock, disponible } = req.body;
        if (!titulo || !autor || !categoria || !stock || !disponible) {
            res.status(400).json({ error: "faltan datos obligatorios" });
        }
        const query =
            "INSERT INTO libro (titulo, autor, categoria, stock , disponible) VALUES ($1,$2,$3, $4, $5) RETURNING *;";
        const result = await pool.query(query, [titulo, autor, categoria, stock, disponible]);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const putLibroId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const resu = await pool.query("SELECT * FROM libro WHERE id_libro =$1", [id]);
        if (resu.rows.length === 0) {
            res.status(404).json({ error: "Libro no encontrado" });
            return;
        }
        const { titulo, autor, categoria, stock, disponible } = req.body;
        if (!titulo || !autor || !categoria || !stock || !disponible) {
            res.status(400).json({ error: "faltan datos obligatorios" });
        }
        const query = `UPDATE libro
            SET 
            titulo = $1,
            autor = $2,
            categoria = $3,           
            stock = $4,
            disponible = $5
            WHERE id_libro = $6
            RETURNING *;
`;
        const result = await pool.query(query, [titulo, autor, categoria, stock, disponible, id]);
        res.status(202).json(result.rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteLibroId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
        }
        const resu = await pool.query("DELETE FROM libro WHERE id_libro = $1;", [id]);
        res.status(200).json({ message: "libro eliminado exitosamente" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};