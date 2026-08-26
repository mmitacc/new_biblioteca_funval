import * as z from "zod";


export const newsocioschema = z.object({
    nombre:z
    .string({
        message: "el nombre tiene que ser un string"
    })
    .trim()
    .min(1, {message: "el nombre no puede estar vacio"})
    ,
    dni:z
    .string({
        message: "el dni tiene que ser un string"
    })
    .trim()
    .min(1, {message: "el dni no puede estar vacio"})
    .max(15, {message: "el dni como maximo puede tener 15 caracteres"})
    .regex(/^[A-Za-z0-9]+$/, {message: "el dni solo puede contener numero y letras"}),

    email:z
    .email({message: "el email tiene que ser un email valido"})
    .trim()
    .min(4, {message:" el email tiene que tener al menos 4 caracteres"}),

    suscripto:z 
    .boolean({message: "el estado de suscripcion tiene que ser un booleano"})
})

export const updatesocioschema = z.object({
    nombre:z
    .string({
        message: "el nombre tiene que ser un string"
    })
    .trim()
    .min(1, {message: "el nombre no puede estar vacio"})
    .optional()
    ,
    dni:z
    .string({
        message: "el dni tiene que ser un string"
    })
    .trim()
    .min(1, {message: "el dni no puede estar vacio"})
    .max(15, {message: "el dni como maximo puede tener 15 caracteres"})
    .regex(/^[A-Za-z0-9]+$/, {message: "el dni solo puede contener numero y letras"})
    .optional(),

    email:z
    .email({message: "el email tiene que ser un email valido"})
    .trim()
    .min(4, {message:" el email tiene que tener al menos 4 caracteres"})
    .optional(),

    suscripto:z 
    .boolean({message: "el estado de suscripcion tiene que ser un booleano"})
    .optional(),
})