import React from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { NavLink, useLocation, Link, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios ,navigate } = useAppContext();
  const location = useLocation();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.product_list_icon },
  ];

  const logout = async () => {
    try{
      const { data }= await axios.get('/api/seller/logout');
      if(data.success){
        toast.success(data.message)
        navigate('/')
    }else{
      toast.error(data.message)
    }
    }catch(error){
     toast.error(error.message)
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img className="h-9" src={assets.logo} alt="logo" />
        </Link>
        <div className="flex items-center gap-5 text-gray-600">
          <p>Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar + Page Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="md:w-64 w-20 border-r border-gray-200 pt-4 flex flex-col bg-white">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-4 hover:bg-gray-100 transition ${
                  isActive ? "bg-primary text-white font-medium" : "text-gray-700"
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <p className="hidden md:block">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Dynamic Route Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
