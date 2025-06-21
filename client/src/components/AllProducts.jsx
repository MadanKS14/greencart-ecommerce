import React, { useEffect, useState } from 'react';
import Productcard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className='mt-16 flex flex-col px-4'>
      {/* Heading - Aligned to left */}
      <div className='flex flex-col items-start w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {/* Product Grid */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <Productcard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
