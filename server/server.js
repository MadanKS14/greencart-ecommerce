import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
import orderRouter from "./routes/orderRoute.js";

import "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/orderController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

let dbErrorMessage = null;

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Stripe webhook must use raw body
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Parse JSON requests
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.send("API Server is running");
});

// Health check
app.get("/api/health", (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    database: isConnected ? "connected" : "disconnected",
    message: dbErrorMessage,
  });
});

// Middleware to ensure DB connection
const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: dbErrorMessage || "Database is not connected yet",
  });
};

app.use("/api", requireDatabase);

// Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Database connection
const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || "greencart",
      serverSelectionTimeoutMS: 10000,
    });

    dbErrorMessage = null;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    dbErrorMessage = error.message;

    console.error("❌ MongoDB Connection Error:", error.message);

    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();