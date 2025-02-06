Para la creacion de Sesiones
// En el archivo server.js

1) npm i express-session

2) import session from 'express-session'

3) app.use(session({
    secret: 'SesionSecreta',
    resave: true, // Resave permite mantener la session activa en caso de que la session se mantenga inactiva. Si se deja en false, ante cualquier inactividad, la session se cierra.
    saveUninitialized: true, // saveUninitialized permite mantener la session activa aun cuando el objeto de la session no contenga nada. Si se deja en false, y el objeto quedo vacio al finalizar la consulta, la session no se guardará.
}))

4) Crear sessiones:
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

5) Cerrar sesiones:
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

6) Para loguearse:
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

7) Para verificar la sesion:
    // Middleware para verificar la session
const autorizacion = (req, res, next) => {
    if(req.session.email == "admin@example.com") {
        next()// Puedo acceder
    } else {
        res.status(401).send("No tienes permisos para acceder a esta ruta")//401 error de autenticación
    }
}

8) Agrego la ruta: 
    app.get('/private', autorizacion,(req, res) => { // ponemos el middleware "autorizacion" en el medio
    res.status(200).send("Contenido del Administrador")
})
