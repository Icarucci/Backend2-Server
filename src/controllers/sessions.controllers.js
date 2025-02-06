import userModel from "../models/users.models.js"
import { createHash, validatePassword } from "../utils/bcrypt.js"

export const login = async (req, res) => {
    
    try {
        if(!req.user) {
            return res.status(401).send("Usuario o contraseña invalidos")
        } else{
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

export const register = async (req,res) => {
    try {
        if(!req.user) { // Consulto si en la sesion se encuentra mi usuario
            return res.status(400).send("El correo ya se encuentra registtado")
        }
        res.status(201).send("Usuario creado correctamente")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error al registrar usuario")
        
    }
}

export const viewRegister = (req, res) => {
    res.status(200).render('templates/register', {})
}

export const viewLogin = (req, res) => {
    res.status(200).render('templates/login', {})
}

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