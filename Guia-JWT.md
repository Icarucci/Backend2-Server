1) npm i jsonwebtoken

2) Creamos un archivo jwt.js dentro de carpeta utils

3) Ejemplo de archivo jwt.js:

import jwt from 'jsonwebtoken';

let secretKey = "codercoder"

const generateToken = (user) => {
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

4) Para utilizar passport-jwt hacemos lo siguiente:

5) npm i passport-jwt

6) En el arquivo passport.config.js:

import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const cookieExtractor = (req) =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies['coderCookie'] //Consulto solamente por las cookies con este nombre
        console.log(req.cookies['coderCookie']);
    }
    return token
}

//Pasos necesarios para trabajar via JWT

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: 'codercoder'

}, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload)
    } catch (e) {
        return done(e);
    }
}));

7) LE asignamos una ruta en session.routes.js

sessionRouter.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {res.send(req.user)});

8) Ahora en session.controller:

import { generateToken } from "../utils/jwt.js"

9) Y adentro del login del sessions.controller agrego el token(Agrego solo la parte de Passport-jwt)

export const login = async (req, res) => {
    
    try {
        if(!req.user) {
            return res.status(401).send("Usuario o contraseña invalidos")
        } else{
            //Passport-jwt
            const token = generateToken(req.user);
            res.cookie('cookie', token, {
                httpOnly: true,
                secure: false, // Evitar errores https
                maxAge: 3600000 // Una hora
            })


            //Genero la sesion de mi usuario
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }
            res.status(200).redirect('/')
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al loguear usuario");
    }
}

10) Debo verificar que la secretkey sea la misma en el archivo jwt y en el passport.config

11) Ahora generamos un control interno de mensajes por errores

12) En passport.config agregamos

//Control de errores por mensajes
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send('<pre>La autenticación falló.\nMotivo: ' + (info?.message ? info.message : info.toString()) + '</pre>');

            }
            req.user = user;
            next();
        })(req, res, next);
    };
};


13) Luego en sessions.routes

import { passportCall } from "../config/passport.config.js"

14) Y edito el /current

sessionRouter.get('/current', passportCall('jwt'), async (req, res) => {res.send(req.user)});