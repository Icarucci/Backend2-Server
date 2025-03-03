import passport from "passport";
import local, { Strategy } from "passport-local";
import { validatePassword, createHash } from "../utils/bcrypt.js";
import userModel from "../models/users.models.js";
import GithubStrategy from 'passport-github2'
import { application } from "express";
import { create } from "express-handlebars";
import jwt from "passport-jwt";
import dotenv from 'dotenv'

dotenv.config()


const localStrategy = local.Strategy // Defuni la estrategia local
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const cookieExtractor = (req) =>{
    let token = null;
    if(req && req.cookies){
        
        token = req.cookies.coderCookie //Consulto solamente por las cookies con este nombre
        
    }
    return token
}

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

const initializePassport = () => {
    passport.use('register', new localStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,username, password, done) => {
    try {
        const {first_name, last_name, email, password, age} = req.body

        const findUser = await userModel.findOne({email: email})

        //Si usuario no existe
        if(!findUser) {
            //Registrar la password con bcrypt
            const user = await userModel.create({
                first_name,
                last_name,
                email,
                password: createHash(password),
                age
            }) 
            return done(null, user) // Doy aviso de que genere un nuevo usuario
        } else {
            return done(null, false, { message: 'El mail ingresado ya existe' })
        }

    } catch (e) {
        return done("Error al obtener el usuario: " +e)
    }
    }))
    passport.use('login', new localStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username})
            if(user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Usuario o contraseña incorrectos' })
            }
        }catch(e){
            return done(e)
        }
    }))

//Passport gitHub
passport.use('github', new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    
}, async (accesToken, refreshToken, profile, done) => {
    try {


        let user = await userModel.findOne({email: profile._json.email})
        if(!user) {
            const user = await userModel.create({
                first_name: profile._json.name,
                last_name: " ", // Dato no proporcionado por gh
                email: profile._json.email,
                password: createHash("1234"), // Dato no proporcionado, generar pssport por defecto
                age: 18 // Dato no proporcionado por gh
            })
            done(null, user)
        } else {
            done(null, user)
        }
    } catch (e) {
        console.error(e);
    }
})) 

    //Pasos necesarios para trabajar via HTTP
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (e) {
            done(e);
        }
    });
}


//Pasos necesarios para trabajar via JWT

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.SECRET_KEY_JWT

}, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload.user)
    } catch (e) {
        return done(e);
    }
}));

//Fin jwt

export default initializePassport;
