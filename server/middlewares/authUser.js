import jwt from "jsonwebtoken";

//  Middleware to authenticate logged-in users
const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user details for later use
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;