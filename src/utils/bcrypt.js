import { hashSync, compareSync, genSaltSync } from "bcrypt";

// Encriptar la contraseña
export const createHash = (password) => hashSync(password, genSaltSync(15))

// Comparar la contraseña ingresada con la encriptada
export const validatePassword = (passIngresada, passBD) => compareSync(passIngresada, passBD)

const passEncriptada = createHash("coderhouse")

