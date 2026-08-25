import { pool } from "../config/db.js";

interface Prestamo {
    id_prestamo: number;
    fecha_prestamo: Date;
    fecha_devolucion: Date;
    devuelto: boolean;
    id_socio: number;
    id_libro: number;
};

// Tipados para transacciones con 'libro'
interface Libro {
    id_libro: number;
    titulo: string;
    autor: string;
    categoria: string;
    stock: number;
    disponible: boolean;
};
type CreateLibroType = Omit<Libro, 'id'>;
type UpdateLibroType = Partial<CreateLibroType>;

// Modelos de conexiones con la Tabla 'libro'
export const LibroModel = {
    findAll: async (): Promise<Libro[]> => {
        const result = await pool.query("SELECT * FROM libro;");
        return result.rows;
    },
    findLibroId: async (id: number): Promise<Libro | null> => {
        const result = await pool.query("SELECT * FROM libro WHERE id_libro =$1", [id]);
        return result.rows[0] || null;
    },
    createLibro: async (dato: CreateLibroType): Promise<boolean> => {
        const { titulo, autor, categoria, stock, disponible } = dato;
        const query =
            "INSERT INTO libro (titulo, autor, categoria, stock , disponible) VALUES ($1,$2,$3, $4, $5) RETURNING *;";
        const { rowCount } = await pool.query(query, [titulo, autor, categoria, stock, disponible]);
        return rowCount ? true : false;
    },
    updateLibroId: async (id: number, dato: CreateLibroType): Promise<UpdateLibroType | null> => {
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
        const result = await pool.query(query, [titulo, autor, categoria, stock, disponible, id]);
        return result.rows[0] || null;
    },
    delLibroId: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM libro WHERE id_libro = $1;", [id]);
        return result.rowCount ? true : false;
    },
    getPrestamo_idLibro: async (id: number): Promise<Prestamo[]> => {
        const result = await pool.query("SELECT * FROM prestamo WHERE id_libro = $1;", [id]);
        return result.rows;
    }
};

export default LibroModel;