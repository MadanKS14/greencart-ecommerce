import React, { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">

      {/* Hero Section */}

      <div className="text-center mb-14">

        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Contact Us
        </h1>

        <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-4"></div>

        <p className="text-gray-600 mt-5 max-w-2xl mx-auto leading-7">
          Have a question, suggestion, or need help with your order?
          Our team is always happy to assist you.
        </p>

      </div>

      {/* Contact Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-14">

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

          <div className="text-4xl mb-4">📍</div>

          <h3 className="text-xl font-semibold text-primary mb-2">
            Address
          </h3>

          <p className="text-gray-600">
            GreenCart Pvt. Ltd.
          </p>

          <p className="text-gray-600">
            Bangalore, Karnataka
          </p>

          <p className="text-gray-600">
            India
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

          <div className="text-4xl mb-4">📧</div>

          <h3 className="text-xl font-semibold text-primary mb-2">
            Email
          </h3>

          <p className="text-gray-600">
            support@greencart.com
          </p>

          <p className="text-gray-600">
            help@greencart.com
          </p>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

          <div className="text-4xl mb-4">📞</div>

          <h3 className="text-xl font-semibold text-primary mb-2">
            Phone
          </h3>

          <p className="text-gray-600">
            +91 98765 43210
          </p>

          <p className="text-gray-600">
            Mon - Sat | 9:00 AM - 7:00 PM
          </p>

        </div>

      </div>

      {/* Main Section */}

      <div className="grid lg:grid-cols-2 gap-12">

        {/* Contact Form */}

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

          <h2 className="text-3xl font-semibold text-primary mb-6">
            Send us a Message
          </h2>

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              placeholder="Your Name"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              placeholder="Your Email"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={changeHandler}
              placeholder="Subject"
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <textarea
              rows="6"
              name="message"
              value={formData.message}
              onChange={changeHandler}
              placeholder="Write your message..."
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dull transition text-white py-3 rounded-lg font-medium"
            >
              Send Message
            </button>

          </form>

        </div>

        {/* FAQ Section */}

        <div>

          <h2 className="text-3xl font-semibold text-primary mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">

            <div className="border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition">

              <h3 className="font-semibold text-lg">
                🚚 How long does delivery take?
              </h3>

              <p className="text-gray-600 mt-2 leading-6">
                Most orders are delivered within
                24 to 48 hours depending on your location.
              </p>

            </div>

            <div className="border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition">

              <h3 className="font-semibold text-lg">
                ❌ Can I cancel my order?
              </h3>

              <p className="text-gray-600 mt-2 leading-6">
                Yes. Orders can be cancelled before they
                are dispatched for delivery.
              </p>

            </div>

            <div className="border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition">

              <h3 className="font-semibold text-lg">
                💳 Which payment methods are accepted?
              </h3>

              <p className="text-gray-600 mt-2 leading-6">
                We support Cash on Delivery and secure
                online payments through Stripe.
              </p>

            </div>

            <div className="border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition">

              <h3 className="font-semibold text-lg">
                🔄 Can I return products?
              </h3>

              <p className="text-gray-600 mt-2 leading-6">
                Yes. Eligible products can be returned
                according to our return policy.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;