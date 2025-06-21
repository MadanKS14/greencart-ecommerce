import React from 'react';
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Productcard from "../components/ProductCard";  // ✅ corrected path
import { categories } from "../assets/assets";


const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className='mt-16 px-4'>
      {searchCategory && (
        <div className='mb-6'>
          <p className='text-2xl font-medium uppercase'>
            {searchCategory.text}
          </p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className='text-gray-500'>No products found in this category.</p>
      ) : (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {filteredProducts.map((product, index) => (
            <Productcard key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
