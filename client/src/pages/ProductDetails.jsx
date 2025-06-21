import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item._id === id);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(related.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] ?? null);
  }, [product]);

  if (!product) return null;

  return (
    <div className="mt-12">
      <p className="text-sm text-gray-600 mb-4">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>{" "}
        / <span className="text-primary">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Image Section */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {Array.isArray(product.image) &&
              product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`border max-w-24 border-gray-300 rounded overflow-hidden cursor-pointer ${
                    thumbnail === image ? "border-primary" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-24 h-24 object-cover"
                  />
                </div>
              ))}
          </div>

          {/* Main Image */}
          <div className="border border-gray-300 rounded overflow-hidden max-w-[400px] max-h-[400px]">
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mt-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.round(product.rating)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
            <p className="ml-2 text-gray-500">({product.rating})</p>
          </div>

          <div className="mt-4 mb-6">
            <p className="text-gray-500 line-through">
              MRP: {currency}
              {product.actualPrice}
            </p>
            <p className="text-2xl font-semibold">
              Offer: {currency}
              {product.offerPrice}
            </p>
            <span className="text-sm text-gray-500">
              (inclusive of all taxes)
            </span>
          </div>

          <p className="text-base font-semibold mt-4 mb-2">About Product</p>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            {Array.isArray(product.description) && product.description.length > 0
              ? product.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))
              : null}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 bg-gray-100 text-gray-800 hover:bg-gray-200 transition rounded font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 bg-primary-dull text-white hover:opacity-90 transition rounded font-medium"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap justify-between gap-4">
            {relatedProducts.map((related) => (
              <div
                key={related._id}
                className="border p-3 rounded-md shadow-sm w-full sm:w-[48%] md:w-[30%] lg:w-[18.5%]"
              >
                {Array.isArray(related.image) && related.image.length > 0 && (
                  <img
                    src={related.image[0]}
                    alt={related.name}
                    className="h-40 w-full object-cover mb-2"
                  />
                )}
                <h3 className="text-sm font-medium">{related.name}</h3>
                <p className="text-sm text-gray-500">
                  {currency}
                  {related.offerPrice}
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/products/${related.category.toLowerCase()}/${related._id}`
                    )
                  }
                  className="text-primary text-sm mt-1 underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* See More Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-primary-dull text-white rounded hover:opacity-90 transition"
            >
              See More
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
