// components/CartButton.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function CartButton({ countOnly = false }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    // Initial count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  if (countOnly) {
    return cartCount > 0 ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
      >
        {cartCount > 99 ? "99+" : cartCount}
      </motion.span>
    ) : null;
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate("/cart")}
        className="relative p-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 border border-purple-100 group"
      >
        <ShoppingCart className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
        
        {/* Cart Count Badge */}
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </motion.span>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Shopping Cart</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {cartCount} items
                </span>
              </div>
              {cartCount > 0 ? (
                <>
                  <p className="text-xs text-gray-600 mb-2">Items ready for checkout</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/cart");
                    }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                  >
                    View Cart
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-600 mb-2">Your cart is empty</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/products");
                    }}
                    className="w-full py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all"
                  >
                    Browse Products
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}