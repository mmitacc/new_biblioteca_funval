import type { PaginationResults } from "../models/global.model.js";
import type { QueryParamsLibro } from "../models/libro.model.js";
import type { Libro } from "../models/libro.model.js";
import LibroModel from "../models/libro.model.js";

const libroService = {
  getLibroFilter: async (
    query: QueryParamsLibro,
  ): Promise<PaginationResults<Libro>> => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search?.trim();
    const minStock = query.minStock ? Number(query.minStock) : undefined;
    const maxStock = query.maxStock ? Number(query.maxStock) : undefined;
    return await LibroModel.findWithFilter(
      page,
      limit,
      search,
      minStock,
      maxStock,
    );
  },
};

export default libroService;
