import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  items: [
    {
      product: { type: String, required: true, ref: 'Product' },
      quantity: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  orderStatus: { type: String, default: 'Pending' },
  paymentType: { type: String, required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
