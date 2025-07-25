import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/all");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-3 md:p-5 max-w-full md:max-w-4xl rounded-md border border-gray-300 bg-white"
            >
              {/* Product Summary */}
              <div className="flex gap-3 md:gap-5 max-w-full md:max-w-80">
                <img
                  className="w-10 h-10 md:w-12 md:h-12 object-cover opacity-60"
                  src={assets.box_icon}
                  alt="box icon"
                />
                <div>
                  {order.items.map((item) => (
                    <p
                      key={item.product?._id || item._id}
                      className="font-medium text-sm md:text-base"
                    >
                      {item.product?.name || "Product"}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Address Info */}
              {order.address ? (
                <div className="text-xs md:text-base text-black/60 break-words">
                  <p className="text-black/80 font-medium">
                    {order.address.firstName || ""}{" "}
                    {order.address.lastName || ""}
                  </p>
                  <p>
                    {order.address.street || ""},{order.address.city || ""}
                  </p>
                  <p>
                    {order.address.state || ""},{order.address.zipcode || ""},{" "}
                    {order.address.country || ""}
                  </p>
                  <p>{order.address.phone || ""}</p>
                </div>
              ) : (
                <p className="text-xs md:text-base text-black/60">
                  Address not available
                </p>
              )}

              {/* Amount */}
              <p className="font-medium text-base md:text-lg my-auto">
                {currency}
                {order.amount}
              </p>

              {/* Payment Info */}
              <div className="flex flex-col text-xs md:text-base text-black/60">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>
                  Payment:{" "}
                  <span
                    className={
                      order.isPaid
                        ? "text-primary"
                        : "text-primary-dull font-medium"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
