import { Router } from "express";
import productRouter from './products.routes.js';
import cartRouter from './cart.routes.js'
import sessionRouter from './sessions.routes.js'

const indexRouter = Router();

indexRouter.use('/api/carts', cartRouter);
indexRouter.use('/api/products', productRouter)
indexRouter.use('/api/sessions', sessionRouter)


export default indexRouter;