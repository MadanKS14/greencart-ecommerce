import User from '../models/user.js';

// ✅ Update User Cart
const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({ success: false, message: "Missing userId or cartItems" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log("Update Cart Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Named Export
export { updateCart };
