import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

await connectCloudinary()

// Use MONGODB_URI from your .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database Connected");

  // Routes after DB connection
  app.use('/api/user', userRouter);
  app.use('/api/seller', sellerRouter);
  app.use('/api/product', productRouter);



  // Start server after DB connection
  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});























//postman 

// {
//   "name": "Madan",
//   "email": "madan@example.com",
//   "password": "123456"
// }
