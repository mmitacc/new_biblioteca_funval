import expres from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import type { Request, Response } from "express";
import libroRouter from './routers/libro.router.js';
import socioRouter from './routers/socios_route.js';
import prestamoRouter from './routers/prestamos.routes.js';

dotenv.config();
const app = expres();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(expres.json());

// Rutas para la tabla 'libro'
app.use('/libro', libroRouter);

// Rutas para la tabla 'socio'
app.use('/socio', socioRouter);

// Rutas para la tabla 'prestamo'
app.use('/prestamo', prestamoRouter);

app.get("/", function (req: Request, res: Response) {
  res.json({
    message: "servidor corriendo exitosamente",
  });
});

console.clear();
app.listen(PORT, async function () {
  console.log("servidor corriendo en http://localhost" + PORT);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      `CONECTADO A POSTGRESQL CON EXITO HORA DEL SERVIDOR ${res.rows[0].now}`,
    );
  } catch (error) {
    console.log("ERROR EN LA CONEXION");
  }
});
