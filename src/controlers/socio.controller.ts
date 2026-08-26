import type { Request, Response } from "express";
import {socioModel} from "../models/socios.models.js"
import {newsocioschema, updatesocioschema} from "../schemas/socios.schemas.js"


export const getsocios = async(req:Request, res:Response) => {
    /* 
    #swagger.tags = ['Socios']
    #swagger.summary = 'Obtener y filtrar todos los Socios de la biblioteca'
    */ 
    try {
      const {suscripto} = req.query
      const socios = await socioModel.findAll(suscripto as string)
      res.json({ lista: socios.length, data: socios})
  } catch (error) {
    res.status(500).json({ error: "hubo un error al trar la tabla socio" });
  }
}

export const getsociobyid = async(req:Request, res: Response) => {
    /* 
    #swagger.tags = ['Socios']
    #swagger.summary = 'Obtener y filtrar un Socio de la biblioteca por su ID'
    */
    try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el ID tiene que ser un numero valido" });
    }
    const resultado = await socioModel.findsocio(id_socio);
    if(!resultado){
      return res.status(404).json({error:"no existe un socio con ese id"})
    }
    res.json(resultado)
  } catch (error) {
    res.status(500).json({ error: "algo salio mal" });
  }
}

export const newsocio = async(req:Request, res: Response) => {
    /* 
    #swagger.tags = ['Socios']
    #swagger.summary = 'Crea un nuevo Socio de la biblioteca'
    */
      try {
        const result = await newsocioschema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const resultado = await socioModel.createsocio(result.data);
    res.status(201).json(resultado);
  } catch (error:any) {
    res.status(500).json({ error: "sucedio un error al crear al socio" });
  }
}

export const updatesocio = async(req:Request, res:Response) => {
    /* 
    #swagger.tags = ['Socios']
    #swagger.summary = 'Actualizar un socio (parcial)'
    #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID del socio a actualizar',
    required: true,
    type: 'integer'
    }
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'Datos a actualizar (campos opcionales)',
    required: false,
    schema: {
    nombre: 'Juan Pérez',
    dni: '12345678',
    email: 'juan@ejemplo.com',
    suscripto: true
    }
    }
    */
    try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el Id deber ser un nuemro valido" });
    }
    const socio = await socioModel.findsocio(id_socio)
        if (!socio) {
      return res.json({ message: "no se encotro a ningun socio con ese ID" });
    }
    const result = await updatesocioschema.safeParse(req.body)
    if(!result.success){
      return res.status(400).json({ error: result.error.issues });
    }
    const resultado = await socioModel.updatesocio(id_socio, req.body);
    if(!resultado){
      return res.status(400).json({error:"necesita actulizar almenos un elemento"})
    }
    res.status(202).json(resultado);
  } catch (error:any) {
    console.error("error", error.message)
    res.status(500).json({ error: "hubo un error al actulizar el usuario" });
  }
}

export const deletesocio = async(req:Request, res:Response) => {
    /* 
    #swagger.tags = ['Socios']
    #swagger.summary = 'Elimina un Socio de la biblioteca por su ID'
    */
      try {
    const id_socio = Number(req.params.id);
    if (isNaN(id_socio)) {
      return res
        .status(400)
        .json({ error: "el id del socio tiene que ser un numero valido" });
    }
    const resultado = await await socioModel.deletesocio(id_socio);
    if(!resultado){
      return res.status(404).json({error:"no se encontro al socio a eliminar"})
    }
    res.json({message: "se elimino con exito al socio"});
  } catch (error) {
    res.status(400).json({ error: "hubo un erro al eliminar al usuario" });
  }
}