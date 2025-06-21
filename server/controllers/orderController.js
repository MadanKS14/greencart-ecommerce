import Order from '../models/Order.js';
import Product from '../models/product.js';

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order details' });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      amount += product.offerPrice * item.quantity;
    }

    amount -= Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
      isPaid: false,
      orderStatus: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.log('Order Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [
        { paymentType: 'COD' },
        { isPaid: true }
      ]
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { paymentType: 'COD' },
        { isPaid: true }
      ]
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
