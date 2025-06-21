import React from 'react';
import Productcard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className="mt-16 hidden md:block"> {/* Hidden on mobile, visible on desktop */}
      <p className="text-2xl md:text-3xl font-medium mb-4">Best Sellers</p>

      <div className="grid grid-cols-5 gap-4">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <Productcard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
