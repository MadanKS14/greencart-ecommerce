import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ===========================
   CASH ON DELIVERY
=========================== */

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items = [], address } = req.body;

    if (!userId || !address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details",
      });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      amount += product.offerPrice * item.quantity;
    }

    // 2% tax
    amount += amount * 0.02;

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
      orderStatus: "Confirmed",
    });

    // ✅ CLEAR USER CART
    await User.findByIdAndUpdate(userId, {
      cartItems: {},
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   STRIPE PAYMENT
=========================== */

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items = [], address } = req.body;

    const origin = req.headers.origin;

    if (!userId || !address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details",
      });
    }

    let amount = 0;

    const line_items = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      amount += product.offerPrice * item.quantity;

      line_items.push({
        price_data: {
          currency: "usd",

          product_data: {
            name: product.name,
          },

          unit_amount: Math.round(product.offerPrice * 100),
        },

        quantity: item.quantity,
      });
    }

    amount += amount * 0.02;

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
      orderStatus: "Pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items,

      success_url: `${origin}/loader?next=my-orders`,

      cancel_url: `${origin}/cart`,

      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   STRIPE WEBHOOK
=========================== */

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);

    return res.status(400).send(error.message);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const { orderId, userId } = session.metadata;

      // ✅ Mark order as paid
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        orderStatus: "Confirmed",
      });

      // ✅ Clear cart
      await User.findByIdAndUpdate(userId, {
        cartItems: {},
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;

      const { orderId } = session.metadata;

      // Delete abandoned order
      await Order.findByIdAndDelete(orderId);

      break;
    }

    default:
      console.log(`Unhandled Event: ${event.type}`);
  }

  res.json({
    received: true,
  });
};

/* ===========================
   USER ORDERS
=========================== */

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    const orders = await Order.find({
      userId,
      $or: [
        {
          paymentType: "COD",
        },
        {
          isPaid: true,
        },
      ],
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   ALL ORDERS (SELLER)
=========================== */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        {
          paymentType: "COD",
        },
        {
          isPaid: true,
        },
      ],
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};