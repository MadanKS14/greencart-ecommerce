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
const PORT = process.env.PORT || 4000;
let dbErrorMessage = null;

const corsOptions = {
  // Use VERCEL_URL in production, fallback to localhost for development
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Server is running');
});

app.get('/api/health', (_req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    success: mongoose.connection.readyState === 1,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    message: dbErrorMessage,
  });
});

const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();

  return res.status(503).json({
    success: false,
    message: dbErrorMessage || 'Database is not connected yet',
  });
};

app.use('/api', requireDatabase);
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in server/.env');
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'greencart',
      serverSelectionTimeoutMS: 10000,
    });

    dbErrorMessage = null;
    console.log('Database Connected');
  } catch (err) {
    dbErrorMessage = err.message;
    console.error('Database Connection Error:', err.message);
  }
};

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

connectDatabase();
