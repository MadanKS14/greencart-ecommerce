import React from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();

  /** Toggle the product’s in-stock status */
  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.put(
        `/api/product/change-stock/${id}`,
        { inStock }
      );

      if (data.success) {
        toast.success(data.message || "Stock status updated");
        fetchProducts(); // refresh list so UI stays in sync
      } else {
        toast.error(data.message || "Failed to update stock");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  console.log("product-list");

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="flex flex-col items-center max-w-4xl w-full rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full">
            <thead className="text-gray-900 text-xs md:text-sm text-left">
              <tr>
                <th className="px-2 md:px-4 py-2 md:py-3 font-semibold">
                  Product
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-semibold">
                  Category
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-semibold hidden md:block">
                  Selling&nbsp;Price
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 font-semibold">
                  In&nbsp;Stock
                </th>
              </tr>
            </thead>

            <tbody className="text-xs md:text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  {/* Product + image */}
                  <td className="md:px-4 pl-2 md:pl-4 py-2 md:py-3 flex items-center space-x-2 md:space-x-3">
                    <div className="border border-gray-300 rounded p-1 md:p-2 shrink-0">
                      <img
                        src={product.image?.[0]}
                        alt={product.name || "Product"}
                        className="w-10 h-10 md:w-16 md:h-16 object-contain"
                      />
                    </div>
                    <span className="truncate max-sm:hidden" title={product.name}>
                      {product.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-2 md:px-4 py-2 md:py-3">{product.category}</td>

                  {/* Price */}
                  <td className="px-2 md:px-4 py-2 md:py-3 max-sm:hidden">
                    {currency}
                    {product.offerPrice}
                  </td>

                  {/* Stock toggle */}
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <label className="relative inline-flex items-center cursor-pointer gap-2 md:gap-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.inStock}
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                      />
                      <div className="w-10 h-6 md:w-12 md:h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary-dull transition-colors duration-200" />
                      <span className="dot absolute left-1 top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4 md:peer-checked:translate-x-5" />
                    </label>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
