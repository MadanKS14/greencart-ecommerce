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

// ✅ Add product (POST): requires seller auth and image upload
productRouter.post('/add', upload.array('image'), authSeller, addProduct);

// ✅ Get all products (GET)
productRouter.get('/list', productList);

// ✅ Get product by ID (GET)
productRouter.get('/:id', getSingleProduct);

// ✅ Change stock status (PUT): requires seller auth
productRouter.put('/change-stock/:id', authSeller, changeStock);

export default productRouter;
