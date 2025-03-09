import userModel from "../models/users.models.js"
import { createHash, validatePassword } from "../utils/bcrypt.js"
import { generateToken } from "../utils/jwt.js"


export const login = async (req, res) => {
    
    try {
        if(!req.user) {
            return res.status(401).json({message: "Usuario o contraseña invalidos"});
        } else{
            //Passport-jwt
            const token = generateToken(req.user);
            res.status(200).cookie('coderCookie', token, {
                httpOnly: true,
                secure: false, // Evitar errores https
                maxAge: 3600000 // Una hora
            }).json({message: "Usuario logueado correctamente"})

            //Genero la sesion de mi usuario
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }

        }
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Error al loguear el usuario"});
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
        res.status(500).json({message: "Error al registrar usuario"})
        
    }
}

export const viewRegister = (req, res) => {
    res.status(200).render('templates/register', {})
}

export const viewLogin = (req, res) => {
    res.status(200).render('templates/login', {
        url_js: "/js/login.js",
        url_css: "/styles.css"
    })
}

export const gitHub = (req, res) => {
    try {
        const token = generateToken(req.user);
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.cookie('coderCookie', token, {
            httpOnly: true,
            secure: false, // Evitar errores https
            maxAge: 3600000 // Una hora
        })
        res.status(200).redirect('/api/products');
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al loguear usuario");
    }
}