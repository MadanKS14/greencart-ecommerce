import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRouter.js';
import addressRouter from './routes/addressRouter.js';
import orderRouter from './routes/orderRoute.js';

import cloudinary from './configs/cloudinary.js';
import { stripeWebhooks } from './controllers/orderController.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.post('/stripe', express.raw({type: 'application/json'}),stripeWebhooks)

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);


    console.log('Database Connected');

    app.use('/api/user', userRouter);
    app.use('/api/seller', sellerRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/order', orderRouter);

    app.get('/', (req, res) => {
      res.send('API Server is running');
    });

    app.listen(4000, () => {
      console.log('Server running at http://localhost:4000');
    });
  } catch (err) {
    console.error('Startup Error:', err.message);
  }
};

startServer();
