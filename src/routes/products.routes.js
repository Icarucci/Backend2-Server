import { Router } from "express";
import { getProduct, getProducts, updateProducts, deleteProducts, createProduct } from "../controllers/productsController.js";

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.get('/:pid', getProduct);

productRouter.post('/', createProduct);

productRouter.put('/:pid', updateProducts);

productRouter.delete('/:pid', deleteProducts);

export default productRouter;