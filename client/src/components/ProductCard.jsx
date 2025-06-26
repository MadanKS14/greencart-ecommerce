import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Productcard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems = {},
    navigate,
  } = useAppContext();

  // Safely compute quantity
  const productId = product?._id;
  const quantity = productId && cartItems[productId] ? cartItems[productId] : 0;

  // Avoid rendering if product is invalid
  if (!product || !productId) return null;

  return (
    <div
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full cursor-pointer"
      onClick={() => navigate(`/product/${productId}`)}
    >
      <div className="group flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.image?.[0] || assets.placeholder_image}
          alt={product.name || "Product Image"}
        />
      </div>
      <div className="text-gray-500/60 text-sm">
        <p>{product.category || "Uncategorized"}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name || "Unnamed Product"}
        </p>

        <div className="flex items-center gap-0.5 mt-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={
                  i < (product.rating || 0)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt="rating"
              />
            ))}
          <p className="ml-1 text-xs text-gray-400">
            ({product.rating ?? 0})
          </p>
        </div>

        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {currency}
            {product.offerPrice ?? "0"}
            <span className="text-gray-500/60 md:text-sm text-xs line-through ml-1">
              {currency}
              {product.price ?? "0"}
            </span>
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            className="text-primary"
          >
            {quantity === 0 ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                onClick={() => addToCart(productId)}
              >
                <img src={assets.cart_icon} alt="cart-icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(productId)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{quantity}</span>
                <button
                  onClick={() => addToCart(productId)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productcard;
