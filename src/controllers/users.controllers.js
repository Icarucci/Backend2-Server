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

        // Verificar si el usuario ya existe por su email
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