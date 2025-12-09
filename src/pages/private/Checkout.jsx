import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard,
  Truck,
  Wallet,
  Shield,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  ArrowLeft,
  AlertCircle,

  Lock,
  Smartphone,
  Globe,
  ShoppingBag,
  
  Clock,
  Gift
} from "lucide-react";

export default function Checkout() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Order data from localStorage or location state
  const [orderData, setOrderData] = useState({
    cart: [],
    deliveryAddress: null,
    total: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0
  });

  // User information
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "Nepal",
    notes: ""
  });

  // Delivery options
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 0,
      time: "2-3 business days",
      icon: <Truck className="w-5 h-5" />,
      freeMin: 999
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 200,
      time: "1-2 business days",
      icon: <Clock className="w-5 h-5" />,
      description: "Priority shipping"
    },
    {
      id: "pickup",
      name: "Store Pickup",
      price: 0,
      time: "Ready in 2 hours",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Pickup from our store"
    }
  ];

  const [selectedDelivery, setSelectedDelivery] = useState("standard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { 
        state: { 
          message: "Please login to checkout",
          returnUrl: "/checkout"
        }
      });
      return;
    }

    // Try to get data from location state first
    if (location.state) {
      setOrderData(location.state);
      loadUserInfo(location.state.deliveryAddress);
    } else {
      // Try to get from localStorage
      const savedCheckout = JSON.parse(localStorage.getItem("checkoutData"));
      if (savedCheckout) {
        setOrderData(savedCheckout);
        loadUserInfo(savedCheckout.deliveryAddress);
      } else {
        // Fallback: get cart from localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          navigate("/cart");
          return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
        const deliveryAddress = JSON.parse(localStorage.getItem("deliveryAddress")) || null;
        
        setOrderData({
          cart,
          deliveryAddress,
          subtotal,
          shipping: 0,
          tax: 0,
          total: subtotal
        });
        
        loadUserInfo(deliveryAddress);
      }
    }

    setLoading(false);
  }, [location.state, navigate]);

  const loadUserInfo = (address) => {
    if (address) {
      setUserInfo(prev => ({
        ...prev,
        fullName: localStorage.getItem("userFullName") || "",
        phone: address.phone || "",
        email: address.email || "",
        address: address.streetAddress || "",
        city: address.city || "",
        country: address.country || "Nepal"
      }));
    } else {
      // Try to get from user data
      const user = JSON.parse(localStorage.getItem("user")) || {};
      setUserInfo(prev => ({
        ...prev,
        fullName: user.fullname || "",
        email: user.email || "",
        phone: user.contact || ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userInfo.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!userInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!userInfo.email.trim()) newErrors.email = "Email is required";
    if (!userInfo.address.trim()) newErrors.address = "Address is required";
    if (!userInfo.city.trim()) newErrors.city = "City is required";
    
    // Phone validation for Nepal
    if (userInfo.phone && !/^98[0-9]{8}$/.test(userInfo.phone)) {
      newErrors.phone = "Enter a valid Nepali phone number (98XXXXXXXX)";
    }
    
    // Email validation
    if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEsewaPayment = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before proceeding with payment.");
      return;
    }

    // Simulate Esewa payment process
    alert("Redirecting to Esewa payment gateway...");
    
    // In real implementation, you would:
    // 1. Generate payment request to your backend
    // 2. Get Esewa payment URL
    // 3. Redirect to Esewa
    // 4. Handle callback
    
    console.log("Initiating Esewa payment...");
    
    // Place order after successful payment
    await placeOrder("esewa");
  };

  const handleCashOnDelivery = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before placing order.");
      return;
    }
    
    await placeOrder("cod");
  };

  const placeOrder = async (paymentMethod) => {
    setPlacingOrder(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Prepare order data
      const orderPayload = {
        items: orderData.cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.finalPrice,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          fullName: userInfo.fullName,
          phone: userInfo.phone,
          email: userInfo.email,
          address: userInfo.address,
          city: userInfo.city,
          country: userInfo.country,
          notes: userInfo.notes
        },
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        subtotal: orderData.subtotal,
        shipping: selectedDelivery === "standard" && orderData.subtotal >= 999 ? 0 : 
                 deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0,
        tax: orderData.tax,
        total: calculateTotal(),
        deliveryOption: selectedDelivery
      };

      // Send order to backend
      const response = await fetch(`${backendUrl}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (response.ok) {
        // Success! - Handle both response structures
        const orderResponse = data.order || data;
        
        setOrderDetails(orderResponse);
        setOrderPlaced(true);
        setShowSuccess(true);
        
        // Clear cart
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutData");
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Redirect to order success page after 5 seconds
        setTimeout(() => {
          navigate(`/my-orders`);
        }, 5000);
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    const shippingCost = selectedDelivery === "standard" && orderData.subtotal >= 999 
      ? 0 
      : deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
    
    return orderData.subtotal + shippingCost + orderData.tax;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderData.cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 max-w-lg w-full"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed! 🎉</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderDetails._id}</p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-medium text-green-800">Payment: {orderDetails.paymentMethod?.toUpperCase() || "COD"}</p>
                <p className="text-green-600">Status: {orderDetails.paymentStatus || "pending"}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-medium text-blue-800">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{orderDetails.total?.toFixed(2) || calculateTotal().toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Redirecting to order details in 5 seconds...</p>
              <button
                onClick={() => navigate(`/my-orders`)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                View Order Details
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Order Placed Successfully!</p>
              <p className="text-sm opacity-90">Redirecting to order details...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <div className="text-sm text-gray-500">
            Step 3 of 3
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                1
              </div>
              <span className="text-sm font-medium">Cart</span>
            </div>
            <div className="h-1 flex-1 mx-4 bg-gray-200">
              <div className="h-full bg-green-500 w-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className="h-1 flex-1 mx-4 bg-gray-200">
              <div className="h-full bg-green-500 w-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={userInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    placeholder="98XXXXXXXX"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Country
                  </label>
                  <select
                    name="country"
                    value={userInfo.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Nepal">Nepal</option>
                  
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  {userInfo.country === "Nepal" ? (
                    <select
                      name="city"
                      value={userInfo.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select City</option>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="city"
                      value={userInfo.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  )}
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    placeholder="House number, street, ward, district"
                    rows="3"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                      errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Order Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={userInfo.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions, delivery preferences, etc."
                    rows="2"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Delivery Options
              </h2>
              
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedDelivery(option.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedDelivery === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedDelivery === option.id
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.time}</p>
                          {option.description && (
                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {option.price === 0 || (option.id === "standard" && orderData.subtotal >= option.freeMin)
                            ? "FREE"
                            : `₹${option.price}`
                          }
                        </p>
                        {option.id === "standard" && orderData.subtotal < option.freeMin && (
                          <p className="text-xs text-amber-600">
                            Add ₹{(option.freeMin - orderData.subtotal).toFixed(2)} for free delivery
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setSelectedPayment("cod")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPayment === "cod"
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedPayment === "cod"
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    {selectedPayment === "cod" && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Esewa */}
                <div
                  onClick={() => setSelectedPayment("esewa")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPayment === "esewa"
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedPayment === "esewa"
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pay with eSewa</h3>
                        <p className="text-sm text-gray-600">Secure online payment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://esewa.com.np/common/images/esewa_logo.png" 
                        alt="eSewa" 
                        className="h-6"
                      />
                      {selectedPayment === "esewa" && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedPayment === "esewa" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        You will be redirected to eSewa's secure payment gateway to complete your payment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-8 space-y-6"
            >
              {/* Order Summary */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Order Summary
                </h2>
                
                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {orderData.cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.finalPrice * item.quantity).toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-xs text-green-600">
                            Save ₹{((item.price - item.finalPrice) * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{orderData.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {selectedDelivery === "standard" && orderData.subtotal >= 999
                        ? "FREE"
                        : `₹${deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0}`
                      }
                    </span>
                  </div>
                  
                  {orderData.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{orderData.tax.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Checkout</p>
                      <p className="text-sm text-gray-600">Your information is protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Privacy Guaranteed</p>
                      <p className="text-sm text-gray-600">We don't share your data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">Read our return policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={selectedPayment === "cod" ? handleCashOnDelivery : handleEsewaPayment}
                disabled={placingOrder}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  placingOrder
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl text-white'
                }`}
              >
                {placingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : selectedPayment === "cod" ? (
                  `Place Order • ₹${calculateTotal().toFixed(2)}`
                ) : (
                  `Pay with eSewa • ₹${calculateTotal().toFixed(2)}`
                )}
              </motion.button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our{' '}
                <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>

              {/* Help */}
              <div className="text-center">
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 mx-auto">
                  <AlertCircle className="w-4 h-4" />
                  Need help? Contact support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}