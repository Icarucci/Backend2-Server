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


	

	


	
	
	