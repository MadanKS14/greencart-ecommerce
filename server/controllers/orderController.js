import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/user.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/* ───── COD ───── */
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items = [], address } = req.body;
    if (!userId || !address || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order details' });
    }

    let amount = 0;
    for (const { product: pid, quantity } of items) {
      const product = await Product.findById(pid);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      amount += product.offerPrice * quantity;
    }
    amount -= Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
      isPaid: false,
      orderStatus: 'Confirmed',
    });

    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ───── Stripe Checkout ───── */
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items = [], address } = req.body;
    const origin = req.headers.origin;

    if (!userId || !address || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order details' });
    }

    let amount = 0;
    const line_items = [];

    for (const { product: pid, quantity } of items) {
      const product = await Product.findById(pid);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      amount += product.offerPrice * quantity;

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: product.name },
          unit_amount: Math.round(product.offerPrice * 100),
        },
        quantity,
      });
    }

    amount -= Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'Online',
      isPaid: false,
      orderStatus: 'Confirmed',
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId: order._id.toString(), userId },
    });

    res.status(201).json({ success: true, sessionUrl: session.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ───── Webhook ───── */
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });
      const { orderId, userId } = sessions.data[0]?.metadata || {};

      if (orderId) await Order.findByIdAndUpdate(orderId, { isPaid: true });
      if (userId) await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });
      const { orderId } = sessions.data[0]?.metadata || {};

      if (orderId) await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      // unhandled event types are logged for debugging
      console.warn(`Unhandled event type ${event.type}`);
      break;
  }

  res.json({ received: true });
};

/* ───── User orders ───── */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ───── All orders ───── */
export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
