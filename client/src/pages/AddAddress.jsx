import React, { useState } from "react";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Address submitted:", formData);
    // You can add navigation or API submission here
  };

  return (
    <div className="mt-16 pb-16 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 text-center">Add Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* Street */}
        <div>
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* Zipcode & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dull transition"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
