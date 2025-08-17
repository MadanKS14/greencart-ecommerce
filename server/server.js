import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import your route handlers
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRouter.js';
import addressRouter from './routes/addressRouter.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

dotenv.config();

const app = express();
let isConnected = false;

const corsOptions = {
  origin: process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(express.json());

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Database Connected');
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
};

connectToDatabase();

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('API Server is running');
});

// Vercel requires a named export for serverless functions
export default app;