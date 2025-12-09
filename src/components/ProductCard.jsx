import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Heart, Star, Zap, Shield, Truck, Tag } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (!product) return null;

  const {
    _id,
    name,
    description,
    price,
    discount,
    images = [],
    brand,
    isFeatured,
    stock,
    rating = 4.5,
    reviewCount = 128
  } = product;

  const discountAmount = discount ? (price * discount) / 100 : 0;
  const finalPrice = (price - discountAmount).toFixed(2);
  const productImages = images.length
    ? images
    : [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" }];
  const isOutOfStock = stock <= 0;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsAdded(cart.some((item) => item._id === _id));
    setIsWishlisted(wishlist.some((item) => item._id === _id));
  }, [_id]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/login", {
        state: {
          message: "Please login to add items to cart",
          returnUrl: window.location.pathname,
        },
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === _id);

    if (existing) {
      setIsAdded(true);
      return;
    }

    const newItem = {
      _id,
      name,
      price,
      finalPrice,
      discount,
      image: productImages[0].url,
      brand,
      quantity: 1,
      maxStock: stock,
    };

    const updatedCart = [...cart, newItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsAdded(true);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/login", {
        state: {
          message: "Please login to manage wishlist",
          returnUrl: window.location.pathname,
        },
      });
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isWishlisted) {
      const updatedWishlist = wishlist.filter((item) => item._id !== _id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      const wishlistItem = {
        _id,
        name,
        price,
        finalPrice,
        discount,
        image: productImages[0].url,
        brand,
      };
      const updatedWishlist = [...wishlist, wishlistItem];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(true);
    }

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleQuickView = (e) => {
  e.stopPropagation(); // keep original behavior
  navigate(`/product/${_id}`);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer
        w-full sm:max-w-sm md:max-w-md lg:max-w-lg"
      onClick={() => navigate(`/product/${_id}`)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {discount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1"
          >
            <Tag className="w-3 h-3" />
            -{discount}% OFF
          </motion.div>
        )}
        {isFeatured && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Featured
          </motion.div>
        )}
        {isOutOfStock && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg"
          >
            Out of Stock
          </motion.div>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0.8, x: 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
      >
        <Heart
          className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${
            isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-600"
          }`}
        />
      </motion.button>

      {/* Image */}
      <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={imageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={productImages[imageIndex]?.url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </AnimatePresence>

        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  imageIndex === idx
                    ? "bg-gradient-to-r from-green-500 to-blue-500 w-5 sm:w-6"
                    : "bg-gray-400/50 hover:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}

        {/* Stock Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
            className={`h-full ${
              stock > 10
                ? "bg-green-500"
                : stock > 0
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <div className="mb-2">
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {brand || "Generic Brand"}
          </p>
          <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 transition-all">
            {name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 sm:w-4 h-3 sm:h-4 ${
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-baseline justify-between mb-4 gap-1 sm:gap-2">
          <div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              रू{finalPrice}
            </span>
            {discount > 0 && (
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  रू{price.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs text-green-600 font-semibold">
                  Save रू{discountAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {stock > 0 && stock <= 10 && (
            <span className="text-[10px] sm:text-xs text-amber-600 font-medium px-2 py-0.5 sm:py-1 bg-amber-50 rounded-full border border-amber-200">
              Only {stock} left
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdded || isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all ${
              isAdded
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                : isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdded ? "Added ✓" : isOutOfStock ? "Out of Stock" : "Add"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="w-10 sm:w-12 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-md"
          >
            <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.button>
        </div>

        {/* Trust Badges */}
        <div className="mt-4 pt-3 sm:pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-[10px] sm:text-xs text-gray-500">
          <div className="flex flex-col items-center">
            <Shield className="w-3 h-3 mb-1" />
            <span>Secure</span>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-3 h-3 mb-1" />
            <span>Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-3 h-3 mb-1" />
            <span>4.5★</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
