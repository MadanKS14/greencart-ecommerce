import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authSeller = async (req, res, next) => {
  try {
    // Get user token
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is a seller
    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Seller access only",
      });
    }

    // Store user details in request
    req.userId = user._id;
    req.role = user.role;

    next();
  } catch (error) {
    console.error("authSeller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authSeller;