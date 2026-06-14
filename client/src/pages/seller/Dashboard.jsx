import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";

import { useAppContext } from "../../context/AppContext";
import RevenueChart from "../../components/seller/RevenueChart";

const Dashboard = () => {
  const { axios, products } = useAppContext();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  const totalCustomers = new Set(
    orders.map((order) => order.userId)
  ).size;

  const cards = [
    {
      title: "Products",
      value: products.length,
      icon: <Package size={34} />,
    },

    {
      title: "Orders",
      value: orders.length,
      icon: <ShoppingCart size={34} />,
    },

    {
      title: "Customers",
      value: totalCustomers,
      icon: <Users size={34} />,
    },

    {
      title: "Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: <IndianRupee size={34} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">

          Welcome Back 👋

        </h1>

        <p className="text-gray-500 mt-2">

          Here's what's happening with your store today.

        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card) => (

          <div
            key={card.title}
            className="
              bg-white
              rounded-2xl
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              border
              p-6
              flex
              justify-between
              items-center
            "
          >

            <div>

              <p className="text-gray-500">

                {card.title}

              </p>

              <h2 className="text-3xl font-bold text-primary mt-2">

                {card.value}

              </h2>

            </div>

            <div
              className="
                w-16
                h-16
                rounded-full
                bg-primary/10
                text-primary
                flex
                items-center
                justify-center
              "
            >
              {card.icon}
            </div>

          </div>

        ))}

      </div>

      <div className="mt-10">
        <RevenueChart orders={orders} />
      </div>

      {/* Recent Orders */}

      <div className="mt-12 bg-white rounded-2xl shadow-sm border p-6">

        <h2 className="text-2xl font-semibold mb-6">

          Recent Orders

        </h2>

        {orders.length === 0 ? (

          <p className="text-gray-500">

            No orders available.

          </p>

        ) : (

          <div className="space-y-4">

            {orders.slice(0, 5).map((order) => (

              <div
                key={order._id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  pb-3
                "
              >

                <div>

                  <p className="font-semibold">

                    {order.items.length} Item(s)

                  </p>

                  <p className="text-sm text-gray-500">

                    {new Date(order.createdAt).toLocaleDateString()}

                  </p>

                </div>

                <div>

                  <span className="font-bold text-primary">

                    ₹{order.amount}

                  </span>

                </div>

                <div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100
                      text-green-700
                      text-sm
                    "
                  >

                    {order.orderStatus}

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;