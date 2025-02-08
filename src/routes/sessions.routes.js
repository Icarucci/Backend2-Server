import { Router } from "express";
import { login, register, viewLogin, viewRegister, gitHub } from "../controllers/sessions.controllers.js";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.get('/viewregister', viewRegister)
sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
sessionRouter.post('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), gitHub )

export default sessionRouter;