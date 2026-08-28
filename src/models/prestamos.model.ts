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

export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

//types
export type CreatePrestamoInput = Omit<Prestamo, "id_prestamo">;
export type UpdatePrestamoInput = Partial<CreatePrestamoInput>;

//funciones de consulta del biblioteca_db

export const PrestamoModel = {
  findAll: async (devuelto?: boolean): Promise<Prestamo[]> => {
    if (devuelto === undefined) {
      const { rows } = await pool.query(
        "SELECT * FROM prestamo ORDER BY id_prestamo ASC;",
      );
      return rows;
    }
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
       SET fecha_devolucion = CURRENT_DATE,
           devuelto = $1
           WHERE id_prestamo = $2
           RETURNING *;`,
      [dato.devuelto, id],
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

  findDuplicate: async (
    id_socio: number,
    id_libro: number,
    fecha_prestamo: string,
  ): Promise<Prestamo | null> => {
    const { rows } = await pool.query(
      `SELECT * FROM prestamo WHERE id_socio = $1  AND id_libro = $2 AND fecha_prestamo = $3;`,
      [id_socio, id_libro, fecha_prestamo],
    );
    return rows[0] || null;
  },

  findWithFilters: async (
    page: number = 1,
    limit: number = 10,
    devuelto?: boolean,
    id_socio?: number,
    id_libro?: number,
  ): Promise<paginaResult<Prestamo>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (devuelto !== undefined) {
      conditions.push(`devuelto = $${paramIndex}`);
      paramIndex++;
      values.push(devuelto);
    }

    if (id_socio !== undefined) {
      conditions.push(`id_socio = $${paramIndex}`);
      paramIndex++;
      values.push(id_socio);
    }

    if (id_libro !== undefined) {
      conditions.push(`id_libro = $${paramIndex}`);
      paramIndex++;
      values.push(id_libro);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countQuery = `SELECT COUNT(*) FROM prestamo ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);
    const offset = (page - 1) * limit;
    const dataValues = [...values, limit, offset];
    const dataQuery = `
    SELECT * FROM prestamo
    ${whereClause}
    ORDER BY id_prestamo ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
  `;

    const { rows } = await pool.query<Prestamo>(dataQuery, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};
