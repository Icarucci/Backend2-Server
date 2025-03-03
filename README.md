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

66) Creacion de cart y products

67) En la carpeta models creamos dos archivos

    cart.js
    product.js

68) Cart.js

import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type:[
            {
                id_prod: {
                    type: Schema.Types.ObjectId, 
                    required: true,
                    ref: 'Product'},
                quantity: {
                    type: Number,
                    required: true, 
                    default: 1}
            }
        ],
        default: []
    }
})

cartSchema.pre('findOne', function(){
    this.populate('products.id_prod')
}
)

const cartModel = model("carts", cartSchema)

export default cartModel;

69) instalamos paginate

npm i mongoose-paginate-v2

70) Product.js

import { Schema, model } from "mongoose";
import { paginate } from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        default: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: { 
        type: String, 
        required: true,
        unique: true
    },
    thumbnail: {
        type: String,
        default: "",
    },
})

productSchema.plugin(paginate)

const productModel = model("products", productSchema)

export default productModel;

71) Creamos el productsController.js dentro de controller
    
import productModel from "../models/product.js";

export const getProducts = async (req, res) => {
    try {
        const {limit, page, metfilter, filter, metOrder, ord} = req.query
        
        const pag = page !== undefined ? page : 1
        const limi = limit !== undefined? limit : 10

        const filQuery = metfilter !== undefined ? {[metfilter] : filter} : {}
        const ordQuery = metOrder !== undefined ? {metOrder : ord} : {}

        const prods = await productModel.paginate(filQuery, {limit: limi, page: pag, ordQuery, lean: true})
        console.log(prods);

        prods.pageNumbers = Array.from({length: prods.totalPages}, (_, i) => ({
            number: i + 1,
            isCurrent: i + 1 === prods.page

        }));

        console.log(prods);
        
        res.status(200).render('templates/home', {prods});


    } catch (e) {
        res.status(500).render('templates/error', {e});
    }
};
    
export const getProduct = async (req, res) => {
    try {
        const idProd = req.params.pid;
        const prod = await productModel.findById(idProd);
        if(prod)
            res.status(200).render('templates/product' , {prod})
        else
            res.status(404).render('templates/error', {e: 'Producto no encontrado'})
    } catch (e) {
        res.status(500).render('templates/error', {e} )
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = req.body
        const rta = await productModel.create(product)
        res.status(201).send("Producto creado")
    } catch (e) {
        res.status(500).render('templates/error', {e})
    }
};

export const updateProducts = async (req, res) => {
    try {
        const updateProduct = req.body
        const idProd = req.params.pid
        const rta = await productModel.findByIdAndUpdate(idProd, updateProduct)
        if(rta)
            res.status(200).redirect('templates/home', {rta})
        else
            res.status(404).render('templates/error', {e: 'Producto no encontrado'})
    } catch (e) {
        res.status(500).render('templates/error', {e})
    }
};

export const deleteProducts = async (req, res, next) => {
    try {
        const idProd = req.params.pid
        const rta = await productModel.findByIdAndDelete(idProd)
        if(rta)
            res.status(200).redirect('templates/home', {rta})
        else
            res.status(404).render('templates/error', {e: 'Producto no encontrado'})
    } catch (e) {
        res.status(500).render('templates/error', {e})
    }
}; 

72) Creamos el products.routes.js dentro de routes

import { Router } from "express";
import { getProduct, getProducts, updateProducts, deleteProducts, createProduct } from "../controllers/productsController";

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.get('/:pid', getProduct);

productRouter.post('/', createProduct);

productRouter.put('/:pid', updateProducts);

productRouter.delete('/:pid', deleteProducts);

export default productRouter;

73) En server.js agregamos lo siguiente:

import productRouter from './routes/products.routes.js';
app.use('api/products', productRouter)

74) Creamos el cartsController.js dentro de controllers

import cartModel from "../models/cart.js";

export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cartId
        const cart = await cartModel.findOne({_id: cartId})
        if (cart) {
            res.status(200).send(cart); //200 es OK
        } else {
            res.status(404).send({ message: 'Carrito no encontrado' });
        }
    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

export const createCart = async (req, res) => {
    try {
        const rta = await cartModel.create({products: []});
        res.status(201).send(rta); //201 es created
    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1) {
                cart.products[indice].quantity = quantity

            }else{
                cart.products.push({_id: productId, quantity: quantity})

            }

            const rta = await cartModel.findByIdAndUpdate(cartId, cart)
            return res.status(200).send(rta); //200 es OK
        } else {
            res.status(404).send({ message: 'Carrito no encontrado' });
            return;
        }

    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}
export const updateProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const {newProduct} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        cart.products = newProduct
        cart.save()
        res.status(200).send(cart)

    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

export const updateQuantityProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1) {
                cart.products[indice].quantity = quantity
                cart.save()
                res.status(200).send(cart)
            }else{
                res.status(404).send("Producto no encontrado")

            }

        } else {
            res.status(404).send({ message: 'Carrito no encontrado' });
        }

    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({_id: cartId})
        if (cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)
            if(indice != -1) {
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            }else{
                res.status(404).send("Producto no existe")

            }

        } else {
            res.status(404).send({ message: 'Carrito no existe' });
        }

    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id: cartId})
        if (cart) {
            cart.products = []
            cart.save()
            res.status(200).send({ message: 'Carrito eliminado con exito' }); //200 es OK
            
        } else {
            res.status(404).send({ message: 'Carrito no existe' })
        }    
    
    } catch (e) {
       res.status(500).render('templates/error', {e}) 
    }
}

75) Creamos el carts.routes.js dentro de routes

import { Router }   from "express";
import { getCart, createCart, insertProductCart, updateProductCart, updateQuantityProductCart, deleteCart, deleteProductCart } from "../controllers/cartsController.js";

const cartRouter = Router();

cartRouter.get('/:cid', getCart);

cartRouter.post('/', createCart);

cartRouter.post('/:cid/products/:pid', insertProductCart);

cartRouter.put('/:cid', updateProductCart);

cartRouter.put('/:cid/products/:pid', updateQuantityProductCart);

cartRouter.delete('/:cid', deleteCart);

cartRouter.delete('/:cid/products/:pid', deleteProductCart);

export default cartRouter;


76) en server.js ponemos:

import cartRouter from './routes/cart.routes.js'
app.use('/api/carts', cartRouter);

77) Para utilizar JWT vemos Guia-JWT

78) Asignar el carrito al usuario creado

79) En user.models.js incorporamos lo siguient:

import cartModel from "./cart.js";

80) Luego editamos el usuario agregando:

    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
    },

81) Y agregamos la siguiente logica:

//Genero un nuevo carrito al crear el usuario
userSchema.post("save", async function name(userCreated){
    try {
        const newCart = await cartModel.create({products: []})
        userCreated.cart = newCart._id // Enlazo el id del carrito con el usuario creado
        await userCreated.updateOne({ cart: newCart._id });
    } catch (e) {
        console.log("Error al crear el carrito del usuario", e);
    }

})

82) Editamos el home.handlebars:

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productos</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/public/styles.css">
</head>
<div class="container mt-5">
    <h1 class="text-center mb-4">Nuestros productos</h1>
    <div class="row">
        {{#each prods.docs}}
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <a href="/api/products/{{this._id}}">
                    <img src="{{this.thumbnail}}" class="card-img-top" alt="Producto" />
                </a>
                <div class="card-body italy-card">
                    <h5 class="card-title">{{this.title}}</h5>
                    <p class="card-text"><strong>Ingredientes: </strong>{{this.description}}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="card-precio mb-0">Valor: $ {{this.price}}</p>
                        <a href="/api/products/{{this._id}}" class="btn btn-primary">Agregar al carrito</a>
                    </div>
                </div>
            </div>
        </div>
        {{/each}}
    </div>
    <!-- Paginacion -->
    <nav aria-label="Page Navigation">
        <ul class="pagination justify-content-center">
            {{#if prods.hasPrevPage}}
            <li class="page-item">
                <a class="page-link" href="?page={{prods.prevPage}}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            {{/if}}
            {{#each prods.pageNumbers}}
            <li class="page-item {{#if this.isCurrent}}active{{/if}}">
                <a class="page-link" href="?page={{this.number}}">{{this.number}}</a>
            </li>
            {{/each}}
            {{#if prods.hasNextPage}}
            <li class="page-item">
                <a class="page-link" href="?page={{prods.nextPage}}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
            {{/if}}
        </ul>
    </nav>
</div>

83) Ver guia de passport-jwt

84) Ver guia de middleware-autorizacion