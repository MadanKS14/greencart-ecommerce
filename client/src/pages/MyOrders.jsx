import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets.js';

const fallbackImage = "https://via.placeholder.com/150";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user', {
        params: { userId: user._id },
      });
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="mt-16 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col items-start sm:items-end mb-8">
        <p className="text-2xl font-semibold uppercase text-gray-800">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-1" />
      </div>

      {myOrders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        myOrders.slice(0, visibleCount).map((order, index) => (
          <div key={index} className="mb-10 p-4 sm:p-6 bg-white rounded-md shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between text-gray-700 text-sm sm:text-base font-medium gap-2">
              <span>Order ID: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>Total: {currency}{order.amount}</span>
            </div>

            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 p-4 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.image?.[0] || item.image}
                    alt={item.product?.name || item.name}
                    onError={handleImageError}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.product?.name || item.name}</p>
                    <p className="text-gray-500 text-sm">Category: {item.product?.category || 'N/A'}</p>
                  </div>
                </div>

                <div className="text-sm sm:text-right text-gray-600 flex flex-col gap-1">
                  <p>Qty: {item.quantity || 1}</p>
                  <p>Status: {order.status || 'Order Placed'}</p>
                  <p>
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p>Amount: {currency}{item.product?.offerPrice * item.quantity}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-4 justify-end pt-2">
              <button className="text-sm border border-primary text-primary px-4 py-1 rounded hover:bg-primary hover:text-white transition">
                View Details
              </button>
              <button className="text-sm bg-primary text-white px-4 py-1 rounded hover:bg-primary-dull transition">
                Repeat Order
              </button>
            </div>
          </div>
        ))
      )}

      {visibleCount < myOrders.length && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="text-sm text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
