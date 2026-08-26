import { create } from "node:domain";
import { pool } from "../config/db.js";
import type { promises } from "node:dns";

export interface Socio{
    id_socio: number,
    nombre: string,
    dni: string,
    email: string,
    suscripto: boolean
}

export type Crearsocio = Omit<Socio,"id_socio">
export type UpdateSocio = Partial<Crearsocio>

export const socioModel = {
    findAll: async(suscripto?:string): Promise<Socio[]> => {
        let consulta = "SELECT * FROM socio"
        let param: any[] = []
        if(suscripto === "true"){
            consulta += " WHERE suscripto = $1"
            param.push(true)
        }else if(suscripto === "false"){
            consulta += " WHERE suscripto = $1"
            param.push(false)
        }
        const {rows} = await pool.query(consulta, param)
        return rows
    },
    findsocio: async(id: number):Promise<Socio | null> =>{
        const {rows} = await pool.query("SELECT * FROM socio WHERE id_socio = $1", [id])
        return rows[0] || null
    },
    createsocio: async(datos:Crearsocio):Promise<Socio> => {
        const {nombre, dni, email, suscripto} = datos
        const query = "INSERT INTO socio (nombre, dni, email, suscripto) VALUES ($1, $2, $3, $4) RETURNING *"
        const {rows} = await pool.query(query,[nombre, dni, email, suscripto])
        return rows[0]
    },
    updatesocio: async(id:number, datos:UpdateSocio):Promise<Socio | null> => {
        const {nombre, dni, email, suscripto} = datos
        let query = "UPDATE socio SET "
        const param: any[] = []
        let index = 1
        let numero_actualizacion = 0
        
        if(nombre !== undefined){
            query += `nombre = $${index++}, `
            param.push(nombre)
            numero_actualizacion++
        }
        if(dni !== undefined){
            query += `dni = $${index++}, `
            param.push(dni)
            numero_actualizacion++
        }
        if(email !== undefined){
            query += `email = $${index++}, `
            param.push(email)
            numero_actualizacion++
        }
        if(suscripto !== undefined){
            query += `suscripto = $${index++}, `
            param.push(suscripto)
            numero_actualizacion++
        }
        query = query.slice(0, -2)
        query += ` WHERE id_socio = $${index} RETURNING * `
        param.push(id)
        const {rows} = await pool.query(query, param)
        return rows[0] || null

    },
    deletesocio: async(id:number):Promise<boolean> => {
        const {rowCount} = await pool.query("DELETE FROM socio WHERE id_socio = $1", [id])
        return (rowCount ?? 0) > 0
    }
}

