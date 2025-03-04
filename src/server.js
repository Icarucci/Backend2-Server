import express from 'express'
import userRouter from './routes/users.routes.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
//import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'
//import sessionRouter from './routes/sessions.routes.js'
import e from 'express'
import { create } from 'express-handlebars'
import path from 'path'
import { __dirname } from './path.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
//import productRouter from './routes/products.routes.js';
//import cartRouter from './routes/cart.routes.js'
import dotenv from 'dotenv'
import indexRouter from './routes/index.routes.js'

dotenv.config()



const app = express()
const PORT = process.env.PORT
const hbs = create()
//const fileStorage = new FileStore(session)

app.use(express.json())
app.use('/api/users', userRouter)
app.use(cookieParser(process.env.SECRET_COOKIE))// Si agrego contraseña, la cookie pasa a estar firmada
app.use(session({
    // ttl: Time to live (tiempo de vida) en segundo
    // retries: Cantidad de veces que el servidor va a intentar leer el archivo

    // Comentamos el store: ya que la nueva conexion sera por Mongo
    // store: new fileStorage({path: './src/sessions', ttl: 60, retries: 1}),
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGO,
        ttl: 15
    }),
    secret: process.env.SECRET_SESSION,
    resave: true, // Resave permite mantener la session activa en caso de que la session se mantenga inactiva. Si se deja en false, ante cualquier inactividad, la session se cierra.
    saveUninitialized: true, // saveUninitialized permite mantener la session activa aun cuando el objeto de la session no contenga nada. Si se deja en false, y el objeto quedo vacio al finalizar la consulta, la session no se guardará.
}))

// Conexion Mongoose

mongoose.connect(process.env.URL_MONGO)
.then(() => console.log('Conectado a BD por Mongoose'))
.catch((error) => console.log('Error al conectarse a BD por Mongoose', error))

// Inicializar passport
initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Handlebars
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')); // COncateno evitando errores de / o de \

// Rutas
//app.use('/api/carts', cartRouter);
//app.use('/api/products', productRouter)
//app.use('/api/sessions', sessionRouter)
//app.use('/public', express.static(__dirname + '/public')) // Concateno rutas
app.use('/', indexRouter);


// Middleware para verificar la session
const autorizacion = (req, res, next) => {
    if(req.session.email == "admin@example.com") {
        next()// Puedo acceder
    } else {
        res.status(401).send("No tienes permisos para acceder a esta ruta")//401 error de autenticación
    }
}


/* -------------Comentamos-------------------

    // Creacion de cookie
app.get('/setCookie', (req, res) => {
    //Devuelve como resultado una cookie
res.status(200).cookie('cookieCoder', 'Esta es mi primera cookie', { maxAge: 10000}).send("Cookie creada")
})
// Crear una cookie firmada
app.get('/setSignedCookie', (req, res) => {
    //Devuelve como resultado una cookie firmada
res.status(200).cookie('cookieCoderSigned', 'Esta es mi primera cookie firmada', { maxAge: 10000, signed: true}).send("Cookie firmada creada")
})
// Consultar una cookie firmada
app.get('/getSignedCookie', (req, res) => {
    res.status(200).send(req.signedCookies)//Devuelve como resultado una cookie firmada
})
// Consultar una cookie
app.get('/getCookie', (req, res) => {
res.status(200).send(req.cookies)})// Devuelvo todas las cookies presentes en el navegador
// Eliminar una cookie
app.get('/deleteCookie', (req, res) => {
    res.clearCookie('cookieCoder').send("Cookie eliminada")
})

// Rutas

// Sessiones
app.get('/session', (req, res) => {
    //Si al conectarse, la session ya existe, entonces aumenta el contador
    if(req.session.counter) {
        req.session.counter++
        res.status(200).send(`Has ingresado ${req.session.counter} veces a la pagina`)
    } else {
        //Si no hay una session existente, inicializa el contador en 1 y envía un mensaje de bienvenida
        req.session.counter = 1
        res.status(200).send(`¡Bienvenido/a a la pagina!`)
    }
})

app.get('/private', autorizacion,(req, res) => { // ponemos el middleware "autorizacion" en el medio
    res.status(200).send("Contenido del Administrador")
})


// Cierre de sesion
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if(!error){
            res.status(200).send("Sesión cerrada")
        }
        else{
            console.log(error)
            res.status(500).send({status: "Error al cerrar la sesión", body: error})
        }
    })
})

// Logueo
app.get('/login', (req, res) => {
    const {email, password} = req.body
    if(email === "admin@example.com" && password === "admin123"){
        req.session.email = email
        req.session.admin = true
        res.status(200).send("Has iniciado sesión correctamente")
    } else {
        res.status(401).send("Usuario o contraseña no validos")
    }
    

}) 

------------------------------------------------------------*/

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})



