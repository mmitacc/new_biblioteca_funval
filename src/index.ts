import expres from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import type { Request, Response } from "express";
import libroRouter from './routers/libro.router.js';
import socioRouter from './routers/socios_route.js';
import prestamoRouter from './routers/prestamos.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();
const app = expres();
const PORT = process.env.PORT || 3000;

// Middleware swagger
const swaggerFilePath = path.resolve('./src/swagger-output.json');
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Archivo swagger cargado, exitosamente!');
} else {
  console.log('Archivo swagger json, no encontrado');
}

app.use(cors());

app.use(expres.json());

// Rutas para la tabla 'libro'
app.use('/libro', libroRouter);

// Rutas para la tabla 'socio'
app.use('/socio', socioRouter);

// Rutas para la tabla 'prestamo'
app.use('/prestamo', prestamoRouter);

app.get("/", function (req: Request, res: Response) {
  /*  
  #swagger.tags = ['Test']
  #swagger.summary = 'Valida la conexion del servidor'
  */
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
      `CONECTADO A POSTGRESQL CON EXITO!
Hora del Servidor ${res.rows[0].now}`,
    );
  } catch (error) {
    console.log("ERROR EN LA CONEXION");
  }
});
