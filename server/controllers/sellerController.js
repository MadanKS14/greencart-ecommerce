import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =====================
// Seller Login
// =====================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await User.findOne({
      email,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      seller.password
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: seller._id,
        role: seller.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// Seller Auth
// =====================
export const isSellerAuth = async (req, res) => {
  return res.json({
    success: true,
  });
};

// =====================
// Seller Logout
// =====================
export const sellerLogout = async (req, res) => {
  res.clearCookie("token");

  return res.json({
    success: true,
    message: "Logged out",
  });
};