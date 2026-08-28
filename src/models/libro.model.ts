import { pool } from "../config/db.js";
import type { PaginationResults } from "./global.model.js";

interface Prestamo {
  id_prestamo: number;
  fecha_prestamo: Date;
  fecha_devolucion: Date;
  devuelto: boolean;
  id_socio: number;
  id_libro: number;
}

// Tipados para transacciones con 'libro'
export interface Libro {
  id_libro: number;
  titulo: string;
  autor: string;
  categoria: string;
  stock: number;
  disponible: boolean;
}
// Tipados para creacion de un registro 'libro'
export type CreateLibroType = Omit<Libro, "id">;
// Tipados para actualizacion de un registro 'libro'
export type UpdateLibroType = Partial<CreateLibroType>;
// Tipados para Query de filtros en 'libro'
export interface QueryParamsLibro {
  page?: string;
  limit?: string;
  search?: string;
  minStock?: string;
  maxStock?: string;
}

// Modelos de conexiones con la Tabla 'libro'
export const LibroModel = {
  findAll: async (): Promise<Libro[]> => {
    const result = await pool.query("SELECT * FROM libro;");
    return result.rows;
  },
  findLibroId: async (id: number): Promise<Libro | null> => {
    const result = await pool.query("SELECT * FROM libro WHERE id_libro =$1", [
      id,
    ]);
    return result.rows[0] || null;
  },
  createLibro: async (dato: CreateLibroType): Promise<boolean> => {
    const { titulo, autor, categoria, stock, disponible } = dato;
    const query =
      "INSERT INTO libro (titulo, autor, categoria, stock , disponible) VALUES ($1,$2,$3, $4, $5) RETURNING *;";
    const { rowCount } = await pool.query(query, [
      titulo,
      autor,
      categoria,
      stock,
      disponible,
    ]);
    return rowCount ? true : false;
  },
  updateLibroId: async (
    id: number,
    dato: CreateLibroType,
  ): Promise<UpdateLibroType | null> => {
    const { titulo, autor, categoria, stock, disponible } = dato;
    const query = `UPDATE libro
            SET 
            titulo = $1,
            autor = $2,
            categoria = $3,           
            stock = $4,
            disponible = $5
            WHERE id_libro = $6
            RETURNING *;`;
    const result = await pool.query(query, [
      titulo,
      autor,
      categoria,
      stock,
      disponible,
      id,
    ]);
    return result.rows[0] || null;
  },
  delLibroId: async (id: number): Promise<boolean> => {
    const result = await pool.query("DELETE FROM libro WHERE id_libro = $1;", [
      id,
    ]);
    return result.rowCount ? true : false;
  },
  getPrestamo_idLibro: async (id: number): Promise<Prestamo[]> => {
    const result = await pool.query(
      "SELECT * FROM prestamo WHERE id_libro = $1;",
      [id],
    );
    return result.rows;
  },
  findWithFilter: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    minStock?: number,
    maxStock?: number,
  ): Promise<PaginationResults<Libro>> => {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramsIndex = 1;
    // Construcción de las 'condiciones'
    if (search) {
      conditions.push(`titulo ILIKE $${paramsIndex}`);
      values.push(`%${search}%`);
      paramsIndex++;
    }
    if (minStock !== undefined) {
      conditions.push(`stock >= $${paramsIndex}`);
      values.push(minStock);
      paramsIndex++;
    }
    if (maxStock !== undefined) {
      conditions.push(`stock <= $${paramsIndex}`);
      values.push(maxStock);
      paramsIndex++;
    }
    // Unir las condiciones con AND
    const whereUnited =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    // Conteo total de los elementos que coinciden con los filtros solicitados
    const countQuery = `SELECT COUNT(*) FROM libro ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].count);
    // Consulta de datos con LIMIT y OFFSET
    const offset = (page - 1) * limit;
    // Agregar el LIMIT y OFFSET a los placeholders dinamicos
    const dataValues: unknown[] = [...values, limit, offset];
    const dataQuery = `
    SELECT * FROM libro
    ${whereUnited}
    ORDER BY id_libro ASC
    LIMIT $${paramsIndex} OFFSET $${paramsIndex + 1}
    `;
    const { rows } = await pool.query(dataQuery, dataValues);
    return {
      data: rows,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit) || 1,
    };
  },
};

export default LibroModel;
