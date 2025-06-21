import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Dummy in-memory "database"
  const [registeredSellers, setRegisteredSellers] = useState([]);

  useEffect(() => {
    // Set default seller only if none exist
    setRegisteredSellers((prev) => {
      if (prev.length === 0) {
        return [{ email: "seller@example.com", password: "123" }];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (isRegister) {
      if (registeredSellers.find((s) => s.email === email)) {
        toast.error("Email already registered");
      } else {
        setRegisteredSellers((prev) => [...prev, { email, password }]);
        toast.success("Registration successful! Please login.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
      }
    } else {
      const foundSeller = registeredSellers.find(
        (s) => s.email === email && s.password === password
      );
      if (foundSeller) {
        setIsSeller(true);
        toast.success("Login successful!");
        navigate("/seller");
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 shadow-lg rounded w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegister ? "Seller Registration" : "Seller Login"}
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-8 text-sm text-primary focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dull transition mb-4"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-primary font-medium hover:underline focus:outline-none"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default SellerLogin;
