import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Star, 
  ChevronLeft, 
  ChevronRight,
  Package,
  
  CheckCircle,
  Zap,
  ShoppingBag,
  MapPin,
  Clock,
  Check,
  Plus,
  Minus,

} from "lucide-react";

export default function ViewProduct() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [deliveryLocation, setDeliveryLocation] = useState({
    country: "Nepal",
    city: "",
    street: ""
  });

  const cartTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
          
          // Check wishlist status
          const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
          setIsWishlisted(wishlist.some(item => item._id === id));
          
          // Check cart status
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const cartItem = cart.find(item => item._id === id);
          if (cartItem) {
            setAddedToCart(true);
            setCartQuantity(cartItem.quantity);
          }
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    // Cleanup timeout on unmount
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, [backendUrl, id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading product details...</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );

  const discountAmount = product.discount ? (product.price * product.discount) / 100 : 0;
  const finalPrice = (product.price - discountAmount).toFixed(2);
  const isOutOfStock = product.stock <= 0;
  const images = product.images?.length ? product.images : [{ url: "/no-image.png" }];
  
  // Handle featuredKeywords whether it's array or string
  const getFeaturedKeywords = () => {
    if (!product.featuredKeywords) return [];
    if (Array.isArray(product.featuredKeywords)) {
      return product.featuredKeywords;
    }
    if (typeof product.featuredKeywords === 'string') {
      return product.featuredKeywords.split(',').map(k => k.trim()).filter(k => k);
    }
    return [];
  };
  
  const featuredKeywords = getFeaturedKeywords();

  const handleAddToCart = async () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login", { 
        state: { 
          message: "Please login to add items to cart",
          returnUrl: `/product/${id}`
        }
      });
      return;
    }

    if (isOutOfStock) {
      alert("This product is out of stock");
      return;
    }

    // Clear any existing timeout
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }

    setIsAddingToCart(true);
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === id);
    let newQuantity = quantity;
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        alert(`Only ${product.stock} items available in stock`);
        setIsAddingToCart(false);
        return;
      }
      existingItem.quantity += quantity;
      newQuantity = existingItem.quantity;
    } else {
      cart.push({
        _id: id,
        name: product.name,
        price: product.price,
        finalPrice,
        discount: product.discount,
        image: images[0].url,
        brand: product.brand,
        quantity: quantity,
        maxStock: product.stock
      });
      newQuantity = quantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Update state
    setAddedToCart(true);
    setCartQuantity(newQuantity);
    setIsAddingToCart(false);
    
    // Set timeout to reset "Added to Cart" after 3 seconds
    cartTimeoutRef.current = setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // Handle direct quantity update from product page
  const handleCartQuantityChange = (change) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(item => item._id === id);
    
    if (!cartItem) {
      handleAddToCart();
      return;
    }
    
    const newQuantity = Math.max(1, Math.min(product.stock, cartItem.quantity + change));
    
    if (newQuantity !== cartItem.quantity) {
      cartItem.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setCartQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login", { 
        state: { 
          message: "Please login to manage wishlist",
          returnUrl: `/product/${id}`
        }
      });
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (isWishlisted) {
      const updatedWishlist = wishlist.filter(item => item._id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      const wishlistItem = {
        _id: id,
        name: product.name,
        price: product.price,
        finalPrice,
        discount: product.discount,
        image: images[0].url,
        brand: product.brand
      };
      const updatedWishlist = [...wishlist, wishlistItem];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(true);
    }
    
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on our store!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getDeliveryInfo = () => {
    const isNepal = deliveryLocation.country === "Nepal";
    const isKathmandu = deliveryLocation.city === "Kathmandu"|| deliveryLocation.city === "Bhaktapur"|| deliveryLocation.city === "Lalitpur";
    
    if (!deliveryLocation.city) {
      return {
        freeDelivery: false,
        message: "Select your city to see delivery options",
        icon: <MapPin className="w-4 h-4" />
      };
    }
    
    if (isNepal && isKathmandu) {
      return {
        freeDelivery: true,
        message: "🎉 FREE Delivery inside Kathmandu Valley",
        icon: <Truck className="w-4 h-4 text-green-500" />
      };
    } else if (isNepal) {
      return {
        freeDelivery: false,
        message: `🚚 Delivery charges will apply for ${deliveryLocation.city}. We'll contact you.`,
        icon: <Truck className="w-4 h-4 text-blue-500" />
      };
    } else {
      return {
        freeDelivery: false,
        message: "🌍 International delivery. We'll contact you with charges.",
        icon: <Truck className="w-4 h-4 text-purple-500" />
      };
    }
  };

  const deliveryInfo = getDeliveryInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Notification */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Added to cart!</p>
              <p className="text-sm opacity-90">{product.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-96">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[selectedImageIndex]?.url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      -{product.discount}% OFF
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Featured Product
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-purple-600 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Breadcrumbs */}
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="hover:text-purple-600 cursor-pointer">{product.category}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="hover:text-purple-600 cursor-pointer">{product.subcategory}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{product.brand}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(4.5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">4.5</span>
                </div>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600">128 reviews</span>
                <span className="text-gray-500">·</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOutOfStock 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    ₹{finalPrice}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-green-600 font-semibold">
                        Save ₹{discountAmount.toFixed(2)} ({product.discount}% off)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Delivery Location Selector */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Check Delivery Options</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <select
                      value={deliveryLocation.country}
                      onChange={(e) => setDeliveryLocation(prev => ({...prev, country: e.target.value}))}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Nepal">Nepal</option>
                      <option value="India">India</option>
                      <option value="Other">Other Countries</option>
                    </select>
                  </div>
                  <div>
                    {deliveryLocation.country === "Nepal" ? (
                      <select
                        value={deliveryLocation.city}
                        onChange={(e) => setDeliveryLocation(prev => ({...prev, city: e.target.value}))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select City</option>
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Pokhara">Pokhara</option>
                        <option value="Other">Other City</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={deliveryLocation.city}
                        onChange={(e) => setDeliveryLocation(prev => ({...prev, city: e.target.value}))}
                        placeholder="Enter city"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
                
                {/* Delivery Info */}
                <div className={`p-3 rounded-xl flex items-start gap-2 ${
                  deliveryInfo.freeDelivery 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  {deliveryInfo.icon}
                  <p className="text-sm flex-1">{deliveryInfo.message}</p>
                </div>
              </div>

              {/* Brand & SKU */}
              <div className="flex items-center gap-6 text-sm">
                {product.brand && (
                  <div>
                    <span className="text-gray-500">Brand:</span>
                    <span className="ml-2 font-medium text-gray-900">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <span className="ml-2 font-mono text-gray-900">{product.sku}</span>
                  </div>
                )}
              </div>

              {/* Attributes */}
              {product.attributes?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.attributes.map((attr, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500">{attr.key}</div>
                        <div className="font-medium text-gray-900">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="w-12 text-center text-xl font-bold bg-white border border-gray-300 rounded-xl py-2">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                          disabled={quantity >= product.stock}
                          className="w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} available
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: addedToCart ? 1 : 1.02 }}
                    whileTap={{ scale: addedToCart ? 1 : 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all relative overflow-hidden group ${
                      addedToCart
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Shine effect on hover */}
                    {!addedToCart && !isOutOfStock && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isAddingToCart ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : addedToCart ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <div className="flex flex-col items-start">
                            <span className="font-bold">Added to Cart</span>
                            <span className="text-xs opacity-90">{cartQuantity} × ₹{finalPrice}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                            <span className="text-xs opacity-90">
                              {quantity} × ₹{finalPrice} = ₹{(quantity * finalPrice).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Cart Quantity Controls (shown when added to cart) */}
                  <AnimatePresence>
                    {addedToCart && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-2"
                      >
                        <button
                          onClick={() => handleCartQuantityChange(-1)}
                          className="w-14 h-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl flex items-center justify-center hover:from-purple-200 hover:to-purple-300 transition-all"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleCartQuantityChange(1)}
                          disabled={cartQuantity >= product.stock}
                          className="w-14 h-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl flex items-center justify-center hover:from-purple-200 hover:to-purple-300 transition-all disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Wishlist and Share buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleWishlist}
                      className="w-14 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <Heart 
                        className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="w-14 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <Share2 className="w-6 h-6 text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Cart Status Indicator */}
                <AnimatePresence>
                  {addedToCart && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-800">Item in your cart</p>
                            <p className="text-sm text-green-600">
                              {cartQuantity} × {product.name} • ₹{(cartQuantity * finalPrice).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/cart")}
                          className="text-sm text-green-700 hover:text-green-800 font-medium px-3 py-1 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                        >
                          View Cart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-500">In Kathmandu Valley</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Return</div>
                  <div className="text-xs text-gray-500">Read our Easy returns policy</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Trusted</div>
                  <div className="text-xs text-gray-500">100% Secure </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto border-b">
              {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                      
                      {/* ✅ FIXED: Safely handle featuredKeywords */}
                      {featuredKeywords.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {featuredKeywords.map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Product Highlights */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <Package className="w-6 h-6 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">Product Details</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category</span>
                              <span className="font-medium">{product.category}</span>
                            </div>
                            {product.subcategory && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subcategory</span>
                                <span className="font-medium">{product.subcategory}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Brand</span>
                              <span className="font-medium">{product.brand || "Generic"}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-6 h-6 text-amber-600" />
                            <h4 className="font-semibold text-gray-900">Stock & Delivery</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stock Status</span>
                              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Time</span>
                              <span className="font-medium">
                                {deliveryLocation.city === "Kathmandu" ? "1-2 days" : "3-7 days"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'specifications' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.attributes?.map((attr, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                            <div className="text-sm text-gray-500 mb-1">{attr.key}</div>
                            <div className="font-medium text-gray-900 text-lg">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Technical Specifications */}
                      {product.metaKeywords && (
                        <div className="mt-8">
                          <h4 className="font-semibold text-gray-900 mb-3">Technical Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(product.metaKeywords) 
                              ? product.metaKeywords 
                              : typeof product.metaKeywords === 'string' 
                                ? product.metaKeywords.split(',') 
                                : []
                            ).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'shipping' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Truck className="w-5 h-5" />
                          Delivery Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Kathmandu Valley</p>
                              <p className="text-sm text-gray-600">Free delivery within 1-2 business days</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Other Nepal Cities</p>
                              <p className="text-sm text-gray-600">Delivery charges apply (3-7 days). We'll contact you.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">International</p>
                              <p className="text-sm text-gray-600">Customs and delivery charges apply. Contact for details.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <Shield className="w-8 h-8 text-green-500 mb-2" />
                          <p className="font-medium text-gray-900">Secure Packaging</p>
                          <p className="text-sm text-gray-600">All products are securely packed</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <Clock className="w-8 h-8 text-blue-500 mb-2" />
                          <p className="font-medium text-gray-900">Delivery Tracking</p>
                          <p className="text-sm text-gray-600">Live tracking available</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                          <CheckCircle className="w-8 h-8 text-purple-500 mb-2" />
                          <p className="font-medium text-gray-900">Quality Check</p>
                          <p className="text-sm text-gray-600">All products quality checked</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Related Products Suggestion */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Add related products component here */}
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Related products will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}