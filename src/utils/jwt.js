import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

let secretKey = process.env.SECRET_KEY_JWT

export const generateToken = (user) => {
    //Crear el token con la información del usuario

    //parametro 1: Objeto a guardar
    //parametro 2: Clave secreta
    //parametro 3: Parámetros adicionales para el token (expiración)
    const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' })
    return token
}


