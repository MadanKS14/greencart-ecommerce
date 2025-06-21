import jwt from 'jsonwebtoken';

// seller login: /api/seller/login
 const sellerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    password === process.env.SELLER_PASSWORD &&
    email === process.env.SELLER_EMAIL
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Logged in successfully' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

// seller is-auth: /api/seller/is-auth
 const isSellerAuth = async (req, res) => {
  try {
    const token = req.cookies.sellerToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, email: decoded.email });
  } catch (error) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

// seller logout: /api/seller/logout
 const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Export all
export { sellerLogin, isSellerAuth, sellerLogout };
