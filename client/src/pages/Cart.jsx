import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    products,
    updateCartItem,
    removeFromCart,
    currency,
    user,
    axios,
    setCartItems,
  } = useAppContext();

  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  /* ---------- address ---------- */
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get", {
        params: { userId: user._id },
      });
      if (data.success) {
        setAddresses(data.address);
        if (data.address.length) setSelectedAddress(data.address[0]);
      }
    } catch (err) {
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  /* ---------- cart products ---------- */
  useEffect(() => {
    if (products.length) {
      const list = Object.entries(cartItems)
        .map(([id, qty]) => {
          const prod = products.find((p) => p._id === id);
          return prod ? { ...prod, quantity: qty } : null;
        })
        .filter(Boolean);
      setCartProducts(list);
    }
  }, [cartItems, products]);

  /* ---------- totals ---------- */
  const subtotal = cartProducts.reduce(
    (sum, i) => sum + i.offerPrice * i.quantity,
    0
  );
  const shippingFee = 0;
  const tax = subtotal * 0.02;
  const total = subtotal + tax + shippingFee;

  /* ---------- order ---------- */
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Please select an address");

    const items = cartProducts.map(({ _id, quantity }) => ({
      product: _id,
      quantity,
    }));

    try {
      let res;
      if (paymentOption === "COD") {
        res = await axios.post("/api/order/cod", {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });
      } else {
        res = await axios.post("/api/order/stripe", {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });
      }

      const { success, message, sessionUrl } = res.data;
      if (!success) return toast.error(message || "Order failed");

      if (paymentOption === "Online" && sessionUrl) {
        window.location.href = sessionUrl; // redirect to Stripe checkout
        return;
      }

      toast.success(message || "Order placed");
      setCartItems({});
      navigate("/my-orders");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">
            {cartProducts.length} Item{cartProducts.length !== 1 ? "s" : ""}
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartProducts.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartProducts.map((p) => (
            <div
              key={p._id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center text-gray-500 pt-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image?.[0] ?? p.image}
                  alt={p.name}
                  className="w-24 h-24 object-cover border rounded"
                />
                <div>
                  <p className="font-semibold hidden md:block">{p.name}</p>
                  <p className="text-xs md:text-sm text-gray-500/70">
                    Size: {p.size || "N/A"}
                  </p>
                  <div className="flex items-center text-xs md:text-sm">
                    Qty:
                    <select
                      className="ml-2 outline-none"
                      value={p.quantity}
                      onChange={(e) =>
                        updateCartItem(p._id, Number(e.target.value))
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <p className="text-center">
                {currency}
                {(p.offerPrice * p.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(p._id)}
                className="mx-auto text-primary"
              >
                Remove
              </button>
            </div>
          ))
        )}

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-primary mt-8"
        >
          &larr; Continue Shopping
        </button>
      </div>

      {/* Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 mt-10 md:mt-0 border">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-5" />

        {/* Address */}
        <p className="text-sm font-medium uppercase">Delivery Address</p>
        <div className="relative mt-2">
          <p className="text-gray-500">
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}`
              : "No address found"}
          </p>
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-primary text-xs"
          >
            Change
          </button>
          {showAddress && (
            <div className="absolute top-10 bg-white border text-sm w-full z-10">
              {addresses.map((ad) => (
                <p
                  key={ad._id}
                  onClick={() => {
                    setSelectedAddress(ad);
                    setShowAddress(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {ad.street}, {ad.city}, {ad.state}, {ad.country}
                </p>
              ))}
              <p
                onClick={() => navigate("/add-address")}
                className="text-primary text-center p-2 cursor-pointer hover:bg-gray-50"
              >
                Add address
              </p>
            </div>
          )}
        </div>

        {/* Payment */}
        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
        <select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
          className="w-full border px-3 py-2 mt-2"
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <hr className="my-5" />

        {/* Totals */}
        <div className="text-gray-500 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium">
            <span>Total Amount:</span>
            <span>
              {currency}
              {total.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white rounded"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
