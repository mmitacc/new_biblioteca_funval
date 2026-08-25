import { pool } from "../config/db.js";
import type { Request, Response } from "express";


export const getsocios = async(req:Request, res:Response) => {
    try {
    const { suscripto } = req.query;
    let consulta = "SELECT * FROM socio";
    let params: any[] = [];
    let donde = false;
    if (suscripto === "true") {
      consulta += " WHERE suscripto = $1";
      params.push(true);
      donde = true;
    } else if (suscripto === "false") {
      consulta += " WHERE suscripto = $1";
      params.push(false);
      donde = true;
    }
    const resultado = await pool.query(consulta, params);
    res.json({ lista: resultado.rowCount, datos: resultado.rows });
  } catch (error) {
    res.status(500).json({ error: "hubo un error al trar la tabla socio" });
  }
}

export const getsociobyid = async(req:Request, res: Response) => {
    try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el ID tiene que ser un numero valido" });
    }
    const resultado = await pool.query("SELECT * FROM socio WHERE id_socio = $1", [
      id_socio,
    ]);
    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "no se encontro a un socio con el id ingresado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "algo salio mal" });
  }
}

export const newsocio = async(req:Request, res: Response) => {
      try {
    const { nombre, dni, email, suscripto } = req.body;
    console.log(`${nombre},${dni},${email},${suscripto}`)
    if (!nombre || !dni || !email || suscripto === undefined) {
      return res.status(400).json({ error: "todos los campos son obligatorios" });
    }
    const query =
      "INSERT INTO socio (nombre, dni, email, suscripto) VALUES ($1, $2, $3, $4) RETURNING * ";
    const resultado = await pool.query(query, [nombre, dni, email, suscripto]);
    res.status(201).json(resultado.rows[0]);
  } catch (error:any) {
    res.status(500).json({ error: "sucedio un error" });
  }
}

export const updatesocio = async(req:Request, res:Response) => {
      try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el Id deber ser un nuemro valido" });
    }
    
    const socio = await pool.query("SELECT * FROM socio WHERE id_socio = $1", [
      id_socio,
    ]);
        if (socio.rows.length === 0) {
      return res.json({ message: "no se encotro a ningun socio con ese ID" });
    }
        const { nombre, dni, email, suscripto } = req.body;
        let query = "UPDATE socio SET ";
        const params:any = []
        let actulizar_num = 0
        let indexnum = 1
    if(nombre !== undefined){
        query += `nombre = $${indexnum++}, `
        params.push(nombre)
        actulizar_num++ 
    }
    if(dni !== undefined){
        query += `dni = $${indexnum++}, `
        params.push(dni)
        actulizar_num++

    }
    if(email !== undefined){
        query += `email = $${indexnum++}, `
        params.push(email)
        actulizar_num++
    }
    if(suscripto !== undefined){
        query += `suscripto = $${indexnum++}, `
        params.push(suscripto)
        actulizar_num++
    }
    if(actulizar_num === 0){
        return res.status(400).json({error: "tiene que actulizar almentos un campo "})
    }

    query = query.slice(0, -2)

    query += ` WHERE id_socio = $${indexnum} RETURNING * `
    params.push(id_socio)

    const resultado = await pool.query(query, params);
    res.status(202).json(resultado.rows[0]);
  } catch (error:any) {
    console.error("error", error.message)
    res.status(500).json({ error: "hubo un error al actulizar el usuario" });
  }
}

export const deletesocio = async(req:Request, res:Response) => {
      try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el id del socio tiene que ser un numero valido" });
    }
    const resultado = await pool.query("DELETE FROM socio WHERE id_socio = $1", [
      id_socio,
    ]);
    res.json({message: "se elimino con exito al socio"});
  } catch (error) {
    res.status(400).json({ error: "hubo un erro al eliminar al usuario" });
  }
}