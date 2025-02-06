import passport from "passport";
import local from "passport-local";
import { validatePassword, createHash } from "../utils/bcrypt.js";
import userModel from "../models/users.models.js";
import GithubStrategy from 'passport-github2'
import { application } from "express";

const localStrategy = local.Strategy // Defuni la estrategia local

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
    clientID: 'Client ID: Iv23liikt0uEh0h4TsQy',
    clientSecret: '',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    
}, async (accesToken, refreshToken, profile, done) => {
    try {
        console.log(profile)
        console.log(accesToken)
        console.log(refreshToken)

        let user = await userModel.findOne({email: profile._json.email})
        if(!user) {
            let newUser = {

            }
            done(null, true)
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

export default initializePassport;
