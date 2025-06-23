import express from 'express';
import authSeller from '../middlewares/authSeller.js';
import {
  addProduct,
  changeStock,
  productList,
  getSingleProduct
} from '../controllers/productController.js';
import { upload } from '../configs/multer.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', getSingleProduct);
productRouter.put('/change-stock/:id', authSeller, changeStock);

export default productRouter;
