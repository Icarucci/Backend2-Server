import { Schema, model } from "mongoose";
import cartModel from "./cart.js";

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
        default: '18',
    },
    rol: { 
        type: String, 
        default: 'Usuario',
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
    },
})

//Genero un nuevo carrito al crear el usuario
userSchema.post("save", async function name(userCreated){
    try {
        const newCart = await cartModel.create({products: []})
        userCreated.cart = newCart._id // Enlazo el ide del carrito con el usuario creado
        await userCreated.updateOne({ cart: newCart._id });
    } catch (e) {
        console.log("Error al crear el carrito del usuario", e);
    }

})

const userModel = model('users', userSchema)

export default userModel;