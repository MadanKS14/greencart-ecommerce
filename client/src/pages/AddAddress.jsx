import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AddAddress = () => {
  const { axios } = useAppContext();        // axios from context
  const navigate = useNavigate();           // router navigation hook

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

  /* keep the change handler simple: just update state */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* submit the entire form here */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/address/add", {
        address: formData,
      });

      if (data.success) {
        toast.success(data.message || "Address added successfully");
        navigate("/cart");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Network error"
      );
    }
  };

  return (
    <div className="mt-16 pb-16 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Add Shipping Address
      </h1>

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
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          required
        />

        {/* Street */}
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          required
        />

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
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
          required
        />

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
