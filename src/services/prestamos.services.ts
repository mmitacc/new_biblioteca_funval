import { PrestamoModel } from "../models/prestamos.model.js";
import type { prestamoQueryParams } from "../schemas/prestamos.schema.js";
import type { paginaResult, Prestamo } from "../models/prestamos.model.js";

export const prestamoService = {
  createPrestamo: async function (
    fecha_prestamo: string,
    fecha_devolucion: string | null,
    devuelto: boolean,
    id_socio: number,
    id_libro: number,
  ): Promise<Prestamo> {
    // limpiar espacios vacios al final e inicio de la fecha
    const cleanFechaPrestamo = fecha_prestamo.trim();

    // evitar que existan 2 prestamos con el mismo socio, libro y fecha
    const prestamoExist = await PrestamoModel.findDuplicate(
      id_socio,
      id_libro,
      cleanFechaPrestamo,
    );

    if (prestamoExist) {
      throw new Error("EL PRESTAMO YA EXISTE!!!");
    }

    return await PrestamoModel.create({
      fecha_prestamo: cleanFechaPrestamo,
      fecha_devolucion,
      devuelto,
      id_socio,
      id_libro,
    });
  },
  getPrestamosFilters: async (
    query: prestamoQueryParams,
  ): Promise<paginaResult<Prestamo>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const devuelto =
      query.devuelto === "true"
        ? true
        : query.devuelto === "false"
          ? false
          : undefined;

    const idSocio = query.id_socio ? Number(query.id_socio) : undefined;
    const idLibro = query.id_libro ? Number(query.id_libro) : undefined;

    return await PrestamoModel.findWithFilters(
      page,
      limit,
      devuelto,
      idSocio,
      idLibro,
    );
  },
};
