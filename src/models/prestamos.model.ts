import { create } from "node:domain";
import { pool } from "../config/db.js";

//tipado de la tabla

export interface Prestamo {
  id_prestamo: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  devuelto: boolean;
  id_socio: number;
  id_libro: number;
}

//types
export type CreatePrestamoInput = Omit<Prestamo, "id_prestamo">;
export type UpdatePrestamoInput = Partial<CreatePrestamoInput>;

//funciones de consulta del biblioteca_db

export const PrestamoModel = {
  findAll: async (): Promise<Prestamo[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM prestamo ORDER BY id_prestamo ASC;",
    );
    return rows;
  },
  findAllByDevuelto: async (devuelto: boolean): Promise<Prestamo[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM prestamo WHERE devuelto = $1 ORDER BY id_prestamo ASC;",
      [devuelto],
    );
    return rows;
  },
  findById: async (id: number): Promise<Prestamo | null> => {
    const { rows } = await pool.query(
      "SELECT * FROM prestamo WHERE id_prestamo = $1;",
      [id],
    );
    return rows[0] || null;
  },
  create: async (dato: CreatePrestamoInput): Promise<Prestamo> => {
    const { fecha_prestamo, fecha_devolucion, devuelto, id_socio, id_libro } =
      dato;
    const query =
      "INSERT INTO prestamo (fecha_prestamo, fecha_devolucion, devuelto, id_socio, id_libro) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const { rows } = await pool.query(query, [
      fecha_prestamo,
      fecha_devolucion || null,
      devuelto,
      id_socio,
      id_libro,
    ]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdatePrestamoInput,
  ): Promise<Prestamo | null> => {
    const { rows } = await pool.query(
      `UPDATE prestamo
       SET fecha_devolucion = $1,
           devuelto = $2
           WHERE id_prestamo = $3
           RETURNING *;`,
      [dato.fecha_devolucion || null, dato.devuelto, id],
    );

    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM prestamo WHERE id_prestamo = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
};
