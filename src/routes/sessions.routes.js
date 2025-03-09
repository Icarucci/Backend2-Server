import { Router } from "express";
import { login, register, viewLogin, viewRegister, gitHub } from "../controllers/sessions.controllers.js";
import passport from "passport";
import { passportCall } from "../config/passport.config.js"
import { authorization } from "../config/middlewares.js"

const sessionRouter = Router()

sessionRouter.post('/login', passportCall('login'), login)
sessionRouter.post('/register', passportCall('register'), register)
sessionRouter.get('/viewregister', viewRegister)
sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),gitHub)
sessionRouter.get('/current', passportCall('jwt'), authorization("Usuario"), async (req, res) => {res.send(req.user)});

export default sessionRouter;