En la pagina de Github:
Derecha en el perfil
Settings
Abajo a la izq developer settings
Githubapp
New githubapp
Agregamos nombre a la app
Agregamos una descripción 
En homepage url ponemos http://localhost:8080
En callback URL ponemos http://localhost:8080/api/sessions/githubcallback
Webhook active (desactivado)
En permisos donde dice Account permisos
Activamos acceso a email y perfil
Where can this Github App indtalled? Esta cuenta
Create githubb app

Luego copio:
App ID (App ID: 1136784)
Client ID (Client ID: Iv23liikt0uEh0h4TsQy)
Generarte new client secret
Copio también el código del cliente (e30aeccbc48ca3aa5b8aaea300c5160e2b5bff41)
Save changes

1) Instalamos passport-github2

    npm i passport-github2

2) En el login.handlebars:

    <h1>
    <a href="/api/sessions/github">Ingresar con GitHub</a>
    </h1>

3) Agregamos en el passport-config

    //Passport gitHub
passport.use('github', new GithubStrategy({
    clientID: 'Iv23liikt0uEh0h4TsQy', // los que aparezcan en mi perfil configurado de github
    clientSecret: 'e30aeccbc48ca3aa5b8aaea300c5160e2b5bff41', // los que aparezcan en mi perfil configurado de github
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

4) Agrego al session.controller

    export const gitHub = (req, res) => {
        
    try {
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }
            res.status(200).redirect('/');
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al loguear usuario");
    }
}

5) Agrego al server.js

    import passport from 'passport'
    import initializePassport from './config/passport.config.js'

    // Inicializar passport
    initializePassport(passport)
    app.use(passport.initialize())
    app.use(passport.session())

    // Rutas
    app.use('/api/sessions', sessionRouter)
    app.use('/public', express.static(__dirname + '/public')) // Concateno rutas
    app.get('/', (req, res) => {
        res.status(200).send("Hola desde el inicio")
    })

6) Session.routes:

import { Router } from "express";
import { login, register, viewLogin, viewRegister, gitHub } from "../controllers/sessions.controllers.js";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.get('/viewregister', viewRegister)
sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), gitHub )

export default sessionRouter;

7) En el passport.config edito

//Passport gitHub
passport.use('github', new GithubStrategy({
    clientID: 'Iv23liikt0uEh0h4TsQy',
    clientSecret: 'e30aeccbc48ca3aa5b8aaea300c5160e2b5bff41',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    
}, async (accesToken, refreshToken, profile, done) => {
    try {
        console.log(profile)
        console.log(accesToken)
        console.log(refreshToken)

        let user = await userModel.findOne({email: profile._json.email})
        if(!user) {
            const user = await userModel.create({
                first_name: profile._json.name,
                last_name: " ", // Dato no proporcionado por gh
                email: profile._json.email,
                password: '1234', // Dato no proporcionado, generar pssport por defecto
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
