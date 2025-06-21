import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// ✅ Middleware to check auth from cookie
export const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export default authUser;
