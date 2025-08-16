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

import { stripeWebhooks } from './controllers/orderController.js';

dotenv.config();

const app = express();

const corsOptions = {
  // Allow requests from the deployed Vercel URL or the local dev server.
  origin: process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// This body parser is only for the /stripe webhook route
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// This body parser is for all other routes
app.use(express.json());

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

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup Error:', err.message);
  }
};

startServer();
