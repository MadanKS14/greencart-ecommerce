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

// Configure CORS to dynamically accept requests from the Vercel URL
const corsOptions = {
  // Use VERCEL_URL in production, fallback to localhost for development
  origin: process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

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

    // Use a dynamic port for production environment
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup Error:', err.message);
  }
};

startServer();
