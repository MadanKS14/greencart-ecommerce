import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Home } from "./pages/Home";
import Login from "./components/Login";
import AllProducts from "./components/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import Contact from "./pages/Contact";
import Dashboard from "./pages/seller/Dashboard";

import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();

  const { isSeller } = useAppContext();

  const isSellerPath = location.pathname.startsWith("/seller");

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}

      <main
        className={
          isSellerPath
            ? ""
            : "px-6 md:px-16 lg:px-24 xl:px-32"
        }
      >
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={<AllProducts />}
          />

          <Route
            path="/products/:category"
            element={<ProductCategory />}
          />

          <Route
            path="/products/:category/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/add-address"
            element={<AddAddress />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />

          <Route
            path="/loader"
            element={<Loading />}
          />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/login"
            element={<Login />}
          />

          {/* Seller Login */}

          <Route
            path="/seller-login"
            element={<SellerLogin />}
          />

          {/* Seller Protected */}

          <Route
            path="/seller"
            element={
              isSeller
                ? <SellerLayout />
                : <Navigate to="/seller-login" replace />
            }
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="add-product"
              element={<AddProduct />}
            />

            <Route
              path="product-list"
              element={<ProductList />}
            />

            <Route
              path="orders"
              element={<Orders />}
            />
          </Route>
        </Routes>
      </main>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;