import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      {/* Background Images */}
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block object-cover"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 px-4 md:px-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-10 max-w-xl w-full shadow-lg">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6 text-center md:text-right">
            Why We Are the Best?
          </h1>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-9 md:w-11 flex-shrink-0"
                />
                <div>
                  <h3 className="text-base md:text-lg font-medium text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
