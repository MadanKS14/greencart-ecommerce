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

// Configure CORS dynamically for Vercel deployment
const corsOptions = {
  // Use VERCEL_URL in production, fallback to localhost for development
  origin: process.env.VERCEL_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// This special body parser is only for the /stripe webhook route
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Regular body parser for all other routes
app.use(express.json());

// A single-instance database connection function for serverless environments
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

// Call the database connection function
connectToDatabase();

// Define your API routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// A simple root endpoint to confirm the API is running
app.get('/', (req, res) => {
  res.send('API Server is running');
});

// Key change: Export the app instance directly for Vercel's serverless runtime
export default app;
