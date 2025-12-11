import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  User,
  Home,
  ShoppingBag,
  Sparkles,
  Cpu,
  Star,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Bell,
  Heart,
  ShoppingCart,
  TrendingUp,
  Tag,
  Award,
  Smartphone,
  Shirt,
  Dumbbell,
  HeartPulse,
  ChevronRight
} from "lucide-react";
import CartButton from "./CartButton";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [siteData, setSiteData] = useState({
    companyName: "NepaliKart",
    logo: null
  });
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }

    // Fetch site data from API
    fetchSiteData();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      
      // Use environment variable for API base URL
      const apiUrl = `${API_BASE_URL}/site`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('Site data response:', data);
      
      if (data.success && data.site) {
        setSiteData({
          companyName: data.site.companyName || "NepaliKarT",
          logo: data.site.logo?.url || null
        });
      } else {
        throw new Error(data.message || 'Failed to fetch site data');
      }
      
    } catch (error) {
      console.error('Error fetching site data:', error);
      
      // Use fallback data
      setSiteData({
        companyName: "NepaliKart",
        logo: "https://res.cloudinary.com/dvp9xszv1/image/upload/v1765006165/ecommerce/site/n4b91yejugbqtnvz2nzr.webp"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setShowUserMenu(false);
  };

  // Products dropdown items
  const productsDropdownItems = [
    { 
      path: "/products", 
      label: "All Products", 
      icon: <ShoppingBag className="w-4 h-4" />,
      description: "Browse all products"
    },
    { 
      path: "/electronics", 
      label: "Electronics", 
      icon: <Cpu className="w-4 h-4" />,
      description: "Phones, Laptops, Gadgets"
    },
    { 
      path: "/fashion", 
      label: "Fashion", 
      icon: <Shirt className="w-4 h-4" />,
      description: "Clothing, Footwear, Accessories"
    },
    { 
      path: "/sports", 
      label: "Sports & Fitness", 
      icon: <Dumbbell className="w-4 h-4" />,
      description: "Equipment, Activewear"
    },
    { 
      path: "/beauty", 
      label: "Beauty & Health", 
      icon: <HeartPulse className="w-4 h-4" />,
      description: "Skincare, Wellness"
    }
  ];

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { 
      label: "Products", 
      icon: <ShoppingBag className="w-4 h-4" />,
      hasDropdown: true
    },
    { path: "/featured", label: "Featured", icon: <Star className="w-4 h-4" /> },
    { path: "/my-orders", label: "My Orders", icon: <Package className="w-4 h-4" /> },
    { path: "/about", label: "About Us", icon: <TrendingUp className="w-4 h-4" /> },
    { path: "/policy", label: "Policy", icon: <Award className="w-4 h-4" /> },
  ];

  const userMenuItems = user ? [
    { label: "My Profile", icon: <User className="w-4 h-4" />, onClick: () => navigate("/profile") },
    { label: "My Orders", icon: <Package className="w-4 h-4" />, onClick: () => navigate("/my-orders") },
    { label: "Wishlist", icon: <Heart className="w-4 h-4" />, onClick: () => navigate("/wishlist") },
    { label: "Notifications", icon: <Bell className="w-4 h-4" />, onClick: () => {} },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, onClick: () => {} },
    { label: "Logout", icon: <LogOut className="w-4 h-4" />, onClick: handleLogout, danger: true },
  ] : [];

  // Check if current page is in products dropdown
  const isProductsPageActive = () => {
    return productsDropdownItems.some(item => location.pathname === item.path);
  };

  // Logo component
  const Logo = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    return (
      <Link to="/" className="flex items-center space-x-2">
        {siteData.logo ? (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-gray-200">
            <img 
              src={siteData.logo} 
              alt={siteData.companyName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.error('Logo failed to load:', siteData.logo);
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                `;
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="hidden sm:block">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            {siteData.companyName}
          </span>
        </div>
      </Link>
    );
  };

  // Mobile Logo component
  const MobileLogo = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center shadow animate-pulse"></div>
        </div>
      );
    }

    return (
      <Link to="/" className="flex items-center space-x-2">
        {siteData.logo ? (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow border border-gray-200">
            <img 
              src={siteData.logo} 
              alt={siteData.companyName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center shadow">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                `;
              }}
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-md border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Desktop */}
            <div className="hidden md:block">
              <Logo />
            </div>

            {/* Logo - Mobile */}
            <div className="md:hidden">
              <MobileLogo />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  // Products Dropdown
                  <div key={link.label} className="relative" onMouseEnter={() => setShowProductsDropdown(true)} onMouseLeave={() => setShowProductsDropdown(false)}>
                    <button
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isProductsPageActive()
                          ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold shadow-sm"
                          : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showProductsDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {/* Products Dropdown Menu */}
                    <AnimatePresence>
                      {showProductsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                          onMouseEnter={() => setShowProductsDropdown(true)}
                          onMouseLeave={() => setShowProductsDropdown(false)}
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">Shop by Category</p>
                            <p className="text-xs text-gray-500">Browse our wide range of products</p>
                          </div>
                          {productsDropdownItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setShowProductsDropdown(false)}
                              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors group ${
                                location.pathname === item.path
                                  ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  location.pathname === item.path
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600 group-hover:bg-green-50 group-hover:text-green-600"
                                }`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Navigation Link
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === link.path
                        ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold shadow-sm"
                        : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Heart className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Cart Button */}
              <CartButton />

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center border border-green-200">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.fullname?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.fullname || "User"}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {userMenuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              item.onClick();
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                              item.danger
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4">
                {/* Mobile Logo and Name */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {siteData.logo ? (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow border border-gray-200">
                      <img 
                        src={siteData.logo} 
                        alt={siteData.companyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center shadow">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    {siteData.companyName}
                  </span>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    link.hasDropdown ? (
                      // Mobile Products Dropdown
                      <div key={link.label} className="space-y-1">
                        <button
                          onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                            isProductsPageActive()
                              ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showProductsDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {/* Mobile Products Submenu */}
                        <AnimatePresence>
                          {showProductsDropdown && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-8 space-y-1 overflow-hidden"
                            >
                              {productsDropdownItems.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setShowProductsDropdown(false);
                                  }}
                                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                      ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {item.icon}
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      // Regular Mobile Link
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === link.path
                            ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    )
                  ))}
                  
                  {!user && (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all mt-4"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Login / Register</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-40 py-2 px-4 shadow-lg">
        <div className="flex justify-around items-center">
          {navLinks.slice(0, 4).map((link) => (
            link.label === "Products" ? (
              // Mobile bottom nav for Products - Show dropdown when clicked
              <div key="products" className="relative">
                <button
                  onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    isProductsPageActive()
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  <div className="w-6 h-6"><ShoppingBag className="w-6 h-6" /></div>
                  <span className="text-xs mt-1">Products</span>
                </button>

                {/* Mobile Bottom Products Dropdown */}
                <AnimatePresence>
                  {showProductsDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setShowProductsDropdown(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-16 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Categories</h3>
                            <button
                              onClick={() => setShowProductsDropdown(false)}
                              className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {productsDropdownItems.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setShowProductsDropdown(false)}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                                  location.pathname === item.path
                                    ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  location.pathname === item.path
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <div className="w-6 h-6">{link.icon}</div>
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            )
          ))}
          <Link
            to="/cart"
            className="flex flex-col items-center p-2 rounded-lg transition-colors text-gray-600 hover:text-green-600 relative"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <CartButton countOnly={true} />
            </div>
            <span className="text-xs mt-1">Cart</span>
          </Link>
        </div>
      </div>
    </>
  );
}