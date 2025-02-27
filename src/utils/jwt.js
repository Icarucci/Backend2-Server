import jwt from 'jsonwebtoken';

let secretKey = "codercoder"

export const generateToken = (user) => {
    //Crear el token con la información del usuario

    //parametro 1: Objeto a guardar
    //parametro 2: Clave secreta
    //parametro 3: Parámetros adicionales para el token (expiración)
    const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' })
    return token
}

console.log(

generateToken({
    //Función para generar un token JWT con la información del usuario
    //user: Objeto con la información del usuario (email, nombre, etc.)
    //Devuelve el token JWT
    first_name: "Ignacio Nicolas Carucci",
    last_name: " ",
    email: "ignaciocarucci@hotmail.com",
    age: 18,
    rol: "Usuario"
}))
