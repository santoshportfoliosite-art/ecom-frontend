import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  Heart,
  MapPin,
  Phone,
  Mail,
  Info,
  CheckCircle,
  AlertCircle,
  Tag,
  Package,
  ArrowRight,
} from "lucide-react";
import useSEO from "../hooks/useSEO";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const seo = useSEO("cart");
  // Delivery Address State
  const [deliveryAddress, setDeliveryAddress] = useState({
    country: "Nepal",
    city: "",
    streetAddress: "",
    phone: "",
    email: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSubmitted, setAddressSubmitted] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    freeDelivery: false,
    deliveryCharges: 0,
    taxApplicable: false,
    taxAmount: 0,
    taxMessage: "",
    deliveryMessage: "",
  });

  // Nepal cities for dropdown
  const nepalCities = [
    "Kathmandu",
    "Bhaktapur",
    "Lalitpur",
    "Pokhara",
    "Other",
  ];

  // Countries list
  const countries = ["Nepal", "Other"];

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login", {
        state: {
          message: "Please login to view your cart",
          returnUrl: "/cart",
        },
      });
      return;
    }

    // Load saved address from localStorage if exists
    const savedAddress =
      JSON.parse(localStorage.getItem("deliveryAddress")) || null;
    if (savedAddress) {
      setDeliveryAddress(savedAddress);
      setAddressSubmitted(true);
      calculateDeliveryInfo(savedAddress);
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setLoading(false);
  }, [navigate]);

  // Calculate delivery info based on address
  const calculateDeliveryInfo = (address) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
    const isNepal = address.country === "Nepal";
    const isKathmandu =
      address.city === "Kathmandu" ||
      address.city === "Lalitpur" ||
      address.city === "Bhaktapur";

    const freeDelivery = isNepal && isKathmandu;

    let deliveryCharges = 0;
    let deliveryMessage = "";

    if (isNepal) {
      if (isKathmandu) {
        deliveryMessage = "🎉 FREE Delivery inside Kathmandu Valley!";
      } else if (address.city) {
        deliveryCharges = 500;
        deliveryMessage = `🚚 Delivery charges will apply for ${address.city}. We'll contact you with exact amount.`;
      } else {
        deliveryMessage =
          "📍 Please select your city to calculate delivery charges.";
      }
    } else {
      deliveryMessage =
        "🌍 International delivery charges will be calculated based on your location.";
    }

    // Tax calculation
    const taxApplicable = !isNepal;
    const taxAmount = taxApplicable ? subtotal * 0.18 : 0;
    const taxMessage = taxApplicable
      ? "International orders may have additional taxes/customs fees. We'll inform you via email/phone."
      : "";

    setDeliveryInfo({
      freeDelivery,
      deliveryCharges,
      taxApplicable,
      taxAmount,
      taxMessage,
      deliveryMessage,
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!deliveryAddress.country) {
      alert("Please select your country");
      return;
    }
    if (!deliveryAddress.city) {
      alert("Please enter your city");
      return;
    }
    if (!deliveryAddress.streetAddress.trim()) {
      alert("Please enter your street address");
      return;
    }
    if (!deliveryAddress.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!deliveryAddress.email.trim()) {
      alert("Please enter your email address");
      return;
    }

    // Save address to localStorage
    localStorage.setItem("deliveryAddress", JSON.stringify(deliveryAddress));

    // Calculate delivery info
    calculateDeliveryInfo(deliveryAddress);

    setAddressSubmitted(true);
    setShowAddressForm(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Recalculate if we have enough info
    if (name === "country" || name === "city") {
      const updatedAddress = { ...deliveryAddress, [name]: value };
      if (updatedAddress.country && updatedAddress.city) {
        calculateDeliveryInfo(updatedAddress);
      }
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );
  const shipping = deliveryInfo.freeDelivery ? 0 : deliveryInfo.deliveryCharges;
  const tax = deliveryInfo.taxApplicable ? deliveryInfo.taxAmount : 0;
  const total = subtotal + shipping + tax;

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id, change) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQuantity = Math.max(
          1,
          Math.min(item.maxStock, item.quantity + change)
        );
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const moveToWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadyInWishlist = wishlist.some((w) => w._id === item._id);

    if (!isAlreadyInWishlist) {
      const wishlistItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        finalPrice: item.finalPrice,
        discount: item.discount,
        image: item.image,
        brand: item.brand,
      };
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...wishlist, wishlistItem])
      );
      window.dispatchEvent(new Event("wishlistUpdated"));
    }

    removeItem(item._id);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!addressSubmitted) {
      alert("Please provide your delivery address first!");
      setShowAddressForm(true);
      return;
    }

    // Save cart and address info for checkout
    const checkoutData = {
      cart,
      deliveryAddress,
      total,
      subtotal,
      shipping,
      tax,
      deliveryInfo,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/checkout", { state: checkoutData });
  };

  if (loading) {
    return (
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (!cart.length)
    return (
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 max-w-md text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to your cart and they'll appear here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/products")}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );

  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Shopping Cart ({cart.length} items)
            </h1>
            <div className="text-sm text-gray-500">
              Total: ₹{total.toFixed(2)}
            </div>
          </div>

          {/* Delivery Info Banner */}
          {deliveryAddress.country === "Nepal" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6" />
                <div>
                  <p className="font-bold">
                    🎉 FREE Delivery inside Kathmandu Valley!
                  </p>
                  <p className="text-sm opacity-90">
                    Enter your address to check delivery options
                  </p>
                </div>
              </div>
              {!addressSubmitted && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-white text-green-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Add Address
                </button>
              )}
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-2xl"
                          />
                          {item.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{item.discount}%
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {item.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {item.brand}
                              </p>
                              {item.quantity >= item.maxStock && (
                                <p className="text-sm text-amber-600 mt-1">
                                  ⚠️ Max stock reached ({item.maxStock} units)
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ₹{(item.finalPrice * item.quantity).toFixed(2)}
                              </p>
                              {item.discount > 0 && (
                                <p className="text-sm text-gray-400 line-through">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                <button
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, 1)}
                                  disabled={item.quantity >= item.maxStock}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-sm text-gray-500">
                                {item.quantity} × ₹{item.finalPrice}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => moveToWishlist(item)}
                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2"
                              >
                                <Heart className="w-4 h-4" />
                                Save
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item._id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-xl hover:from-red-200 hover:to-red-300 transition-all flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar - Order Summary & Address */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Delivery Address
                  </h2>
                  {addressSubmitted && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {addressSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Address Saved</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {deliveryAddress.streetAddress}, {deliveryAddress.city},{" "}
                        {deliveryAddress.country}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        📞 {deliveryAddress.phone} | ✉️ {deliveryAddress.email}
                      </p>
                    </div>

                    {/* Delivery Info */}
                    {deliveryInfo.deliveryMessage && (
                      <div
                        className={`p-3 rounded-xl border ${
                          deliveryInfo.freeDelivery
                            ? "bg-green-50 border-green-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Info
                            className={`w-4 h-4 mt-0.5 ${
                              deliveryInfo.freeDelivery
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          />
                          <p className="text-sm">
                            {deliveryInfo.deliveryMessage}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-3">
                      Please add your delivery address to proceed
                    </p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                )}

                {/* Address Form (Modal/Expanded) */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Enter Delivery Details
                      </h3>
                      <form
                        onSubmit={handleAddressSubmit}
                        className="space-y-4"
                      >
                        {/* Country */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={deliveryAddress.country}
                            onChange={handleAddressChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          {deliveryAddress.country === "Nepal" ? (
                            <select
                              name="city"
                              value={deliveryAddress.city}
                              onChange={handleAddressChange}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select City</option>
                              {nepalCities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              name="city"
                              value={deliveryAddress.city}
                              onChange={handleAddressChange}
                              placeholder="Enter your city"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          )}
                        </div>

                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                          </label>
                          <textarea
                            name="streetAddress"
                            value={deliveryAddress.streetAddress}
                            onChange={handleAddressChange}
                            placeholder="Full address with house number, street, area"
                            rows="3"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            required
                          />
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={deliveryAddress.phone}
                              onChange={handleAddressChange}
                              placeholder="98XXXXXXXX"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <Mail className="w-4 h-4 inline mr-1" />
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={deliveryAddress.email}
                              onChange={handleAddressChange}
                              placeholder="your@email.com"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-6 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <div className="text-right">
                      {addressSubmitted ? (
                        <>
                          <span
                            className={
                              deliveryInfo.freeDelivery
                                ? "text-green-600 font-semibold"
                                : "font-semibold"
                            }
                          >
                            {deliveryInfo.freeDelivery
                              ? "FREE"
                              : deliveryInfo.deliveryCharges > 0
                              ? `₹${deliveryInfo.deliveryCharges}`
                              : "Calculated"}
                          </span>
                          {!deliveryInfo.freeDelivery &&
                            deliveryInfo.deliveryCharges === 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Will contact you
                              </p>
                            )}
                        </>
                      ) : (
                        <span className="text-gray-400">Add address</span>
                      )}
                    </div>
                  </div>

                  {/* Tax */}
                  {deliveryInfo.taxApplicable && addressSubmitted && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax & Customs</span>
                      <div className="text-right">
                        <span className="text-amber-600 font-semibold">
                          ₹{deliveryInfo.taxAmount.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Will inform via email/phone
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tax Message for International */}
                  {deliveryInfo.taxMessage && addressSubmitted && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-700">
                          {deliveryInfo.taxMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{addressSubmitted ? total.toFixed(2) : "--"}
                      </span>
                    </div>
                    {!addressSubmitted && (
                      <p className="text-sm text-gray-500 mt-2">
                        Complete address to see total
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={!addressSubmitted}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                    addressSubmitted
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addressSubmitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      Proceed to Checkout • ₹{total.toFixed(2)}
                    </span>
                  ) : (
                    "Add Address First"
                  )}
                </motion.button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-6 border-t border-gray-200 mt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span>Free shipping in Kathmandu Valley</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <span>Cash on Delivery Available</span>
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/products")}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
