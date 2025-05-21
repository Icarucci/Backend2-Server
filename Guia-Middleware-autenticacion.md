1) Creamos un archivo middleware.js en la carpeta config

2) El archivo debe decir lo siguiente:

export const authorization = (rol) => {
    return async (req, res, next) => {
        if(!req.user) return res.status(401).send("No autenticado")

        if(req.user.rol != rol) return res.status(403).send("No autorizado")
            
        next()
    }
}

3) en session-routes importamos:

import { authorization } from "../config/middlewares.js"

4) Para probar, agregamos el middleware por ej en current para que solo puedan acceder los Admin

sessionRouter.get('/current', passportCall('jwt'), authorization("Admin"), async (req, res) => {res.send(req.user)});

5) Ahora ponemos las autorizaciones en el product-routes, para saber que puede hacer un admin con los productos

import { authorization} from "../config/middlewares.js";

productRouter.post('/', authorization("Admin"), createProduct);

productRouter.put('/:pid', authorization("Admin"), updateProducts);

productRouter.delete('/:pid', authorization("Admin"), deleteProducts);

6) Ahora en cart-routes asignamos que puede hacer un usuario y que puede hacer un admin con los carritos

import { authorization} from "../config/middlewares.js";

cartRouter.get('/:cid', getCart);

cartRouter.post('/', authorization("Usuario"), createCart);

cartRouter.post('/:cid/products/:pid', authorization("Usuario"), insertProductCart);

cartRouter.put('/:cid', authorization("Usuario"), updateProductCart);

cartRouter.put('/:cid/products/:pid', authorization("Usuario"), updateQuantityProductCart);

cartRouter.delete('/:cid', authorization("Usuario"), deleteCart);

cartRouter.delete('/:cid/products/:pid', authorization("Usuario"), deleteProductCart);
