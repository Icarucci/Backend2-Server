import { Router } from "express";
import { login, register, viewLogin, viewRegister, gitHub } from "../controllers/sessions.controllers.js";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.get('/viewregister', viewRegister)
sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    // Si el login es correcto, redirigimos a /api/products(Provisorio)
    res.redirect('/api/products');
  })

export default sessionRouter;