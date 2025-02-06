Para iniciar el proyecto:

//Instalo package.json
1) npm init --yes

//Instalo express mongoose
2) npm i express mongoose

3) Creo la carpeta src

4) Dentro de la carpeta src creo las carpetas:
	routes
	controllers
	models

5) Creo un archivo server.js

6) Creo el archivo .gitignore que contenga lo siguiente:
	node_modules

7) Creo un script en el archivo package.json para que corra el servidor automáticamente
	  "scripts": {
    "start": "node --watch src/server.js"
  },

8) También en el archivo package.json edito el "type"
	  "type": "module",

9) En la terminal pongo:
	npm run start

10) En el archivo server.js pongo lo siguiente:

	import express from 'express'

const app = express()
const PORT = 8080


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

11) En la carpeta models creo un archivo que se llame users.models.js

12) Dentro del mismo pongo lo siguiente:
	import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number, 
        required: true,
    }
})

const userModel = model('users', userSchema)

export default userModel;

13) Luego creamos dentro de la carpeta controllers un archivo que se llama users.controllers.js

14) El archivo users.controllers.js debe contener lo siguiente:

	import userModel from "../models/users.models.js";

// Consultar un usuario por ID
export const getUser = async (req,res) => {
    try {
        const idUser = req.params.uid
        const user = await userModel.findById(idUser);
        if (user) {
            res.status(200).send(user);//200 es OK
    
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }

}

// Obtener todos los usuarios
export const getUsers = async (req,res) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);//200 es OK
        

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }

}

// Crear un nuevo usuario con nombre, email y edad pedidos al usuario via req.body
export const createUser = async (req,res) => {
    try {
        const {name, email, age} = req.body;

        //Verificar si el usuario ya existe por su email
        const existingUser = await userModel.findOne({ email });
        if(existingUser) {
            return res.status(400).send({ message: 'Ya existe un usuario con esa direccion de email' });
        }

        const newUser = await userModel.create({ name, email, age });
        res.status(201).send({ message: 'Usuario creado con éxito', user: newUser });//201 es Create

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }

}

// Actualizar un usuario por ID
export const updateUser = async (req,res) => {
    try {
        const idUser = req.params.uid
        const {name, email, age} = req.body;
        const message = await userModel.findByIdAndUpdate(idUser, {name, email, age});
        if(message){
            res.status(200).send({ message: 'Usuario actualizado con exito' });//200 es OK
        }
        else{
            res.status(404).send({ message: 'Usuario no encontrado' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
        
    }

}

// Eliminar un usuario por ID
export const deleteUser = async (req,res) => {
    try {
        const idUser = req.params.uid
        const message = await userModel.findByIdAndDelete(idUser)
        if(message){
            res.status(200).send({ message: 'Usuario eliminado con exito' });//200 es OK
        }
        else{
            res.status(404).send({ message: 'Usuario no encontrado' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
        
    }

}

15) Creo el archivo users.routes.js dentro de la carpeta routes

16) El archivo users.routes.js debe contener lo siguiente:

	import { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser } from "../controllers/users.controllers.js";



const userRouter= Router()

userRouter.get('/', getUsers)
userRouter.get('/:uid', getUser)
userRouter.post('/', createUser)
userRouter.put('/:uid', updateUser)
userRouter.delete('/:uid', deleteUser)

export default userRouter;

17) En el archivo server, importo userRouter
	import userRouter from './routes/users.routes.js'

18) Le agrego lo siguiente:
	app.use(express.json())
	app.use('/api/users', userRouter)

19) En resumen ya tengo creada mi api, habiendo creado primero el modelo, luego el controlador y por ultimo la ruta

20) Ahora conectamos con mongo atlas

21) Creo el cluster 

22) Recordar copiar la contraseña (EMR0Q9b3rZGViZbd)

23) En server.js importo mongoose
	import mongoose from 'mongoose'

24) En mongoDB voy a mi cluster creado, y en Application Development, GET CONNECTION STRIN.

25) Luego copio el código de Add your connection string into your application code.

26) Lo agrego en server.js y recordar cambiar donde dice <db_password> por nuestra contraseña copiada anteriormente:
	
	mongoose.connect('mongodb+srv://ignaciocarucci:EMR0Q9b3rZGViZbd@backend2.y4q03.mongodb.net/?retryWrites=true&w=majority&appName=Backend2')
.then(() => {
    console.log('Conexión exitosa a MongoDB')
})

27) Luego de utilizar las cookies, sessions, sessions file store, mongo-store:
    Vamos por el login

28) Creamos en la carpeta src/routes un archivo llamado sessions.routes.js

    import { Router } from "express";
    import { login, register } from "../controllers/sessions.controllers.js";

    const sessionRouter = Router()

    sessionRouter.post('/login', login)
    sessionRouter.post('/register', register)

    export default sessionRouter;

29) Creamos en la carpeta src/controllers un archivo llamado sessions.controllers.js

import userModel from "../models/users.models.js"

import userModel from "../models/users.models.js"

export const login = async (req, res) => {
    const {email, password} = req.body

    const user = await userModel.findOne({ email: email})

    // Si user no existe = undefined
    if(user && (password == user.password)){ 
        //Genero la sesion de mi usuario
        req.session.email = email
        req.session.rol = user.rol
        req.session.first_name = user.first_name
        req.session.last_name = user.last_name
        req.session.age = user.age
        res.status(200).send("Has iniciado sesión correctamente")

    } else {
        res.status(401).send("Usuario o contraseña inválidos")
    }
}

export const register = async (req,res) => {
    const {first_name, last_name, email, password, age} = req.body
    try {
        let message = await userModel.create({first_name, last_name, email, password, age})
        res.status(201).send({message: 'Usuario registrado correctamente', user: message})
    } catch (e) {
        res.status(500).send({message : 'Error al registrar usuario', error: e})
    }
}

30) En archivo server importamos sessionRouter

    import sessionRouter from './routes/sessions.routes.js'

31) Creamos el app.use

    app.use('/api/sessions', sessionRouter)

32) instalamos mongoose:

    npm i mongoose

33) Importamos mongoose:

    import mongoose from 'mongoose'

34) Conectamos a mongoose: (Revisar no tener otra conexion anterior a mongoose)

    // Conexion Mongoose

mongoose.connect('mongodb+srv://ignaciocarucci:EMR0Q9b3rZGViZbd@backend2.y4q03.mongodb.net/?retryWrites=true&w=majority&appName=Backend2')
.then(() => console.log('Conectado a BD por Mongoose'))
.catch((error) => console.log('Error al conectarse a BD por Mongoose', error))

35) Verifico no haber creado anteriormente en src una carpeta models y el archivo user.models.js, sino lo creo con lo siguiente:

    import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number, 
        required: true,
    }
})

const userModel = model('users', userSchema)

export default userModel;

36) Para agregar un rol a los usuarios agregamos al users.models.js lo siguiente:

        rol: { 
        type: String, 
        default: 'Usuario',
    }
	
37) Para la creacion de las vistas:

    npm i express-handlebars

38) EN server.js:

    import { create } from 'express-handlebars'

    const hbs = create()

    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')
    
	
39) Luego en la carpeta src creo una carpeta views y dentro otra carpeta layouts.
    Dentro de layouts creo el archivo main.handlebars

40) Creo un html5 en main.handlebars

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    {{>header}}  // el > indica que esta en una subcarpeta
    {{{body}}}
    {{>footer}}  // el > indica que esta en una subcarpeta
</body>
</html>

41) Dentro de la carpeta views creo la carpeta partials y dentro el archivo header.handlebars y footer.handlebars (Les pongo el html que yo quiera)

42) Creo dentro de la carpeta views, la carpeta templates, y dentro los archivos register.handlebars y login.handlebars ( Les pongo el html que quiera)

43) Crear el archivo path.js al mismo nivel que server.js y pongo lo siguiente:

    import { fileURLToPath } from 'url'
    import { dirname } from 'path'

    export const __filename = fileURLToPath(import.meta.url)
    export const __dirname = dirname(__filename)

44) Luego en server.js importo:

    import path from 'path'
    import { __dirname } from './path.js'

    app.set('views', path.join(__dirname, 'views')); // COncateno evitando errores de / o de \

    // Rutas
    app.use('/api/sessions', sessionRouter)
    app.use('/public', express.static(__dirname + '/public')) // Concateno rutas

45) Agrego al session.controller las views

    export const viewRegister = (req, res) => {
    res.status(200).render('templates/register', {})
}

export const viewLogin = (req, res) => {
    res.status(200).render('templates/login', {})
}

46) Agrego en session.routes las rutas

    sessionRouter.get('/viewregister', viewRegister)
    sessionRouter.get('/viewlogin', viewLogin)

47) Para redireccionar, voy al session.controller y edito el .send por .redirect

    //Redirect es para redireccionar a una ruta de mi aplicacion
        res.status(201).redirect('/api/sessions/viewLogin')//.send({message: 'Usuario registrado correctamente', user: message}

48) Para que la contraseña no quede al alcance de cualquiera que acceda a la bd, lo aconsejable es Hashearla. Para eso utilizamos bcrypt.

    npm i bcrypt

49) Dentro de la carpeta src, creamos otra carpeta llamada utils, dentro de ella un archivo llamado bcrypt.js

50) EN el archivo bcrypt.js ingresamos lo siguiente:

    import { hashSync, compareSync, genSaltSync } from "bcrypt";

    // Encriptar la contraseña
    export const createHash = (password) => hashSync(password, genSaltSync(15))

    // Comparar la contraseña ingresada con la encriptada
    export const validatePassword = (passIngresada, passBD) => compareSync(passIngresada, passBD)

    const passEncriptada = createHash("coderhouse")

    console.log(passEncriptada)
    console.log(validatePassword("coderhouse", passEncriptada));

51) En el sessions.controller importo lo siguiente:

    import { createHash, validatePassword } from "../utils/bcrypt.js"

52) Dentro del archivo sessions.controller en el register, debo agregar en el try lo siguiente:

        //Registrar la password con bcrypt
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
        }
        let message = await userModel.create(newUser)

53) Dentro del mismo archivo, en el login, debo cambiar la siguiente linea:

        if(user && (password == user.password)){ 

        POR

        if(user && validatePassword(password , user.password)){ 

54) Para utilizar logueon con passport: (EN este caso passport local)

    npm i passport passport-local

55) Creamos en la carpeta src, carpeta config y dentro archivo passport.config.js

56) En passport.config.js ponemos lo siguiente:

    import passport from "passport";
    import local from "passport-local";
    import { validatePassword, createHash } from "../utils/bcrypt.js";
    import userModel from "../models/users.models.js";

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


57) En server.js importamos:

    import passport from 'passport'
    import initializePassport from './config/passport.config.js'

58) Luego agregamos:

    // Inicializar passport
    initializePassport(passport)
    app.use(passport.initialize)
    app.use(passport.session())

59) En sessions.controller debe quedar asi:

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

60) En sessions.routes importamos passport

    import passport from "passport";

61) Y modificamos el register:

    sessionRouter.post('/register', passport.authenticate('register'), register)

62) Para que passport funcione debemos implementar serialize y deserialize, por lo tanto debemos agregar la logica en el archivo de passport.

        passport.deserializeUser(async (id, done) => {
            try {
                const user = await userModel.findById(id);
                done(null, user);
            } catch (e) {
                done("Error al obtener el usuario: " + e);
            }
        });

63)  Modificamos el login del session.controller

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
                res.status(200).send("Usuario logueado correctamente");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Error al loguear usuario");
        }
    }
64) Modificamos el login del sessions.routes

    sessionRouter.post('/login', passport.authenticate('login'), login)

65) Para PAssportgithub ver guia de passport-github

