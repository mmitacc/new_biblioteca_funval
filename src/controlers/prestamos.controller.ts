import { pool } from "../config/db.js";
import type { Request, Response } from "express";

//GET PARA VER TODOS LOS PRESTAMOS
/* export async function getPrestamos(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM prestamo;");
    res.json({
      message: "Conexion exitosa a la base de datos :D",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos :c",
    }) */ /* }
}
 */

//get para ver

export async function getPrestamos(req: Request, res: Response) {
  try {
    const { devuelto } = req.query;

    let query = "SELECT * FROM prestamo";
    const params: any[] = [];

    if (devuelto !== undefined) {
      if (devuelto !== "true" && devuelto !== "false") {
        res.status(400).json({
          error: "El parámetro devuelto debe ser true o false",
        });
        return;
      }

      query += " WHERE devuelto = $1";
      params.push(devuelto === "true");
    }

    query += " ORDER BY id_prestamo";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

//GET PARA VER UN PRESTAMOS POR SU ID
export async function getPrestamosById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
      return;
    }
    const resu = await pool.query(
      "SELECT * FROM prestamo WHERE id_prestamo =$1",
      [id],
    );
    if (resu.rows.length === 0) {
      res.status(404).json({ error: "Prestamo no encontrado" });
      return;
    }
    res.json(resu.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//POST PARA CREAR UN PRESTAMO
export async function postPrestamo(req: Request, res: Response) {
  try {
    const { fecha_prestamo, fecha_devolucion, devuelto, id_socio, id_libro } =
      req.body;

    if (!fecha_prestamo || devuelto === undefined || !id_socio || !id_libro) {
      res.status(400).json({
        error: "faltan datos obligatorios",
      });
      return;
    }

    const query = `
      INSERT INTO prestamo (
        fecha_prestamo,
        fecha_devolucion,
        devuelto,
        id_socio,
        id_libro
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      fecha_prestamo,
      fecha_devolucion || null,
      devuelto,
      id_socio,
      id_libro,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

//put para actualizar

export async function putPrestamo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "EL ID DEBE SER UN VALOR NUMERICO",
      });
      return;
    }

    const { fecha_devolucion, devuelto } = req.body;

    if (devuelto === undefined) {
      res.status(400).json({
        error: "El campo devuelto es obligatorio",
      });
      return;
    }

    const query = `
      UPDATE prestamo
      SET
        fecha_devolucion = $1,
        devuelto = $2
      WHERE id_prestamo = $3
      RETURNING *;
    `;

    const result = await pool.query(query, [
      fecha_devolucion || null,
      devuelto,
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Prestamo no encontrado",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// delete para eliminar

export async function deletePrestamo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: "EL ID DEBE SER UN VALOR NUMERICO",
      });
      return;
    }

    const query = "DELETE FROM prestamo WHERE id_prestamo = $1 RETURNING *;";

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Prestamo no encontrado",
      });
      return;
    }

    res.json({
      message: "Prestamo eliminado correctamente",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
