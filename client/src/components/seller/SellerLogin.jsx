import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, setUser, axios } = useAppContext();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setUser(data.user);

        setIsSeller(true);

        toast.success("Seller Login Successful");

        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Seller Login
        </h2>

        <div className="mb-4">
          <label>Email</label>

          <input
            type="email"
            className="w-full border rounded p-2 mt-1"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div className="mb-4">
          <label>Password</label>

          <div className="relative">
            <input
              type={
                showPassword ? "text" : "password"
              }
              className="w-full border rounded p-2 mt-1"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>
        </div>

        <button className="w-full bg-primary text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Seller accounts must be created
          using the normal registration page
          by selecting
          <b> Seller </b>
          as the role.
        </p>
      </form>
    </div>
  );
};

export default SellerLogin;