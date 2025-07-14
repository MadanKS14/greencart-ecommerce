import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

/* ---------------- axios defaults ---------------- */
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

/* ---------------- context ---------------- */
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  /* ---------- constants ---------- */
  // const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  /* ---------- state ---------- */
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({}); // { [productId]: qty }
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------- helpers ---------- */
  // Convert object → array for backend
  const cartToArray = (obj) =>
    Object.entries(obj).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

  // Convert array|object|null → object for state
  const toCartObject = (input) => {
    if (!input) return {};
    if (Array.isArray(input))
      return input.reduce((acc, { productId, quantity }) => {
        acc[productId] = quantity;
        return acc;
      }, {});
    if (typeof input === "object") return input;
    return {};
  };

  /* ---------- auth ---------- */
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(toCartObject(data.user.cartItems));
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (err) {
      console.error(
        "User auth failed:",
        err?.response?.data?.message || err.message
      );
      setUser(null);
      setCartItems({});
    }
  }, []);

  const fetchSeller = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(Boolean(data.success));
    } catch {
      setIsSeller(false);
    }
  }, []);

  /* ---------- products ---------- */
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  /* ---------- cart operations ---------- */
  const addToCart = (productId) =>
    setCartItems((prev) => {
      const next = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      toast.success("Added to cart");
      return next;
    });

  const updateCartItem = (productId, quantity) =>
    setCartItems((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      toast.success("Cart updated");
      return next;
    });

  const removeFromCart = (productId) =>
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        next[productId] -= 1;
        if (next[productId] === 0) delete next[productId];
        toast.success("Removed from cart");
      }
      return next;
    });

  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, q) => sum + q, 0);

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((total, [productId, qty]) => {
      const item = products.find((p) => p._id === productId);
      return item ? total + item.offerPrice * qty : total;
    }, 0);

  /* ---------- side‑effects ---------- */
  // initial app load
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, [fetchUser, fetchSeller, fetchProducts]);

  // sync cart whenever it changes
  useEffect(() => {
    // must be logged in
    if (!user) return;
    // skip empty cart (server rejects empty payload)
    if (Object.keys(cartItems).length === 0) return;

    const syncCart = async () => {
      try {
        const payload = {
          userId: user._id, // some backends require this
          cartItems: cartToArray(cartItems),
        };
        console.log("Syncing cart:", payload);
        const { data } = await axios.post("/api/cart/update", payload);
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      }
    };

    syncCart();
  }, [cartItems, user]);

  /* ---------- context value ---------- */
  const value = {
    /* navigation */
    //navigate,
    /* auth */
    user,
    setUser,
    isSeller,
    setIsSeller,
    /* products */
    products,
    fetchProducts,
    /* cart */
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    /* misc */
    searchQuery,
    setSearchQuery,
    currency,
    axios,
    setCartItems
  };

  return (
    <AppContext.Provider value={value}>
      <Toaster position="top-center" />
      {children}
    </AppContext.Provider>
  );
};

/* ---------- custom hook ---------- */
export const useAppContext = () => useContext(AppContext);
