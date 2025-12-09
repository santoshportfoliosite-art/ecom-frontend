import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sliders,
  Tag,
  Sparkles,
  AlertCircle,
  Heart,
  Star,
  Zap,
  Clock,
  Package,
  Shield,
  Droplets,
  Scissors,
  Smile,
  Palette,
  Gem,
  Thermometer,
  Pill,
  Leaf,
  User,
  Sparkle,
  Flower,
  Waves,
  ShoppingBag,
  TrendingUp
} from "lucide-react";

export default function Beauty() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedConcern, setSelectedConcern] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [skinType, setSkinType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Beauty categories
  const categories = [
    { value: "all", label: "All Products", icon: <Sparkle className="w-4 h-4" /> },
    { value: "skincare", label: "Skincare", icon: <Droplets className="w-4 h-4" /> },
    { value: "makeup", label: "Makeup", icon: <Palette className="w-4 h-4" /> },
    { value: "haircare", label: "Haircare", icon: <Waves className="w-4 h-4" /> },
    { value: "fragrance", label: "Fragrance", icon: <Flower className="w-4 h-4" /> },
    { value: "bathbody", label: "Bath & Body", icon: <Droplets className="w-4 h-4" /> },
    { value: "wellness", label: "Wellness", icon: <Leaf className="w-4 h-4" /> },
    { value: "tools", label: "Beauty Tools", icon: <Scissors className="w-4 h-4" /> },
  ];
  
  // Skin/Hair concerns
  const concerns = [
    { value: "all", label: "All Concerns", icon: <Heart className="w-4 h-4" /> },
    { value: "acne", label: "Acne & Blemishes", icon: <Thermometer className="w-4 h-4" /> },
    { value: "aging", label: "Anti-Aging", icon: <Clock className="w-4 h-4" /> },
    { value: "hydration", label: "Hydration", icon: <Droplets className="w-4 h-4" /> },
    { value: "brightening", label: "Brightening", icon: <Sparkle className="w-4 h-4" /> },
    { value: "sensitive", label: "Sensitive Skin", icon: <Shield className="w-4 h-4" /> },
    { value: "hairfall", label: "Hair Fall", icon: <Waves className="w-4 h-4" /> },
    { value: "dandruff", label: "Dandruff", icon: <Leaf className="w-4 h-4" /> },
    { value: "dryness", label: "Dryness", icon: <Droplets className="w-4 h-4" /> },
    { value: "oilcontrol", label: "Oil Control", icon: <Thermometer className="w-4 h-4" /> },
  ];
  
  // Skin types
  const skinTypes = [
    { value: "all", label: "All Skin Types", icon: <User className="w-4 h-4" /> },
    { value: "normal", label: "Normal", icon: <Smile className="w-4 h-4" /> },
    { value: "dry", label: "Dry", icon: <Droplets className="w-4 h-4" /> },
    { value: "oily", label: "Oily", icon: <Thermometer className="w-4 h-4" /> },
    { value: "combination", label: "Combination", icon: <Palette className="w-4 h-4" /> },
    { value: "sensitive", label: "Sensitive", icon: <Shield className="w-4 h-4" /> },
  ];
  
  // Popular beauty brands
  const brands = [
    { value: "all", label: "All Brands" },
    { value: "lakme", label: "Lakmé" },
    { value: "maybelline", label: "Maybelline" },
    { value: "loreal", label: "L'Oréal" },
    { value: "nykaa", label: "Nykaa" },
    { value: "maccosmetics", label: "MAC" },
    { value: "huda", label: "Huda Beauty" },
    { value: "thebodyshop", label: "The Body Shop" },
    { value: "forestessentials", label: "Forest Essentials" },
    { value: "kamaayurveda", label: "Kama Ayurveda" },
    { value: "plum", label: "Plum" },
    { value: "mamaearth", label: "Mamaearth" },
    { value: "dove", label: "Dove" },
    { value: "nivea", label: "Nivea" },
  ];
  
  // Price ranges (beauty products typically have different ranges)
  const priceRanges = [
    { min: 0, max: 500, label: "Under रू 500" },
    { min: 500, max: 2000, label: "रू 500 - 2,000" },
    { min: 2000, max: 5000, label: "रू 2,000 - 5,000" },
    { min: 5000, max: 10000, label: "रू 5,000 - 10,000" },
    { min: 10000, max: 100000, label: "Over रू 10,000" },
  ];

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchBeautyProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();
        
        if (res.ok) {
          const productsArray = data.products || data;
          
          // Filter beauty & health products
          const beautyProducts = productsArray.filter(product => {
            const category = product.category?.toLowerCase();
            const name = product.name?.toLowerCase();
            const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
            
            const beautyKeywords = [
              'beauty', 'cosmetic', 'skincare', 'skin care', 'makeup', 'make-up',
              'cosmetics', 'beauty product', 'facial', 'face', 'cream', 'lotion',
              'serum', 'moisturizer', 'toner', 'cleanser', 'wash', 'scrub',
              'mask', 'face mask', 'sheet mask', 'eye cream', 'lip care',
              'lipstick', 'lipstick', 'lip gloss', 'lip balm', 'foundation',
              'concealer', 'powder', 'blush', 'bronzer', 'highlighter',
              'eyeshadow', 'eyeliner', 'mascara', 'kajal', 'eyebrow',
              'nail polish', 'nail care', 'nail', 'manicure', 'pedicure',
              'hair', 'haircare', 'hair care', 'shampoo', 'conditioner',
              'hair oil', 'hair mask', 'hair serum', 'hair spray', 'hair gel',
              'fragrance', 'perfume', 'deo', 'deodorant', 'body spray',
              'body lotion', 'body butter', 'body wash', 'shower gel',
              'soap', 'bath', 'bath salt', 'bath bomb', 'scented candle',
              'wellness', 'health', 'supplement', 'vitamin', 'mineral',
              'ayurveda', 'ayurvedic', 'herbal', 'natural', 'organic',
              'tool', 'brush', 'comb', 'hair dryer', 'straightener',
              'curler', 'trimmer', 'razor', 'shaver', 'epilator',
              'sunscreen', 'sunblock', 'spf', 'uv protection', 'tan',
              'acne', 'pimple', 'blemish', 'anti-aging', 'wrinkle',
              'hydration', 'moisture', 'dry skin', 'oily skin', 'combination',
              'sensitive', 'brightening', 'glow', 'radiance', 'whitening',
              'dark circles', 'puffiness', 'hair fall', 'hair growth',
              'dandruff', 'dry hair', 'oily scalp', 'color protection'
            ];
            
            return beautyKeywords.some(keyword => 
              category?.includes(keyword) || 
              name?.includes(keyword) ||
              tags.includes(keyword)
            );
          });
          
          setProducts(beautyProducts);
          setFilteredProducts(beautyProducts);
        } else {
          setMessage(data.message || "Failed to load beauty products.");
        }
      } catch (err) {
        setMessage("Error loading beauty products.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBeautyProducts();
  }, [backendUrl]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        const category = product.category?.toLowerCase() || "";
        const subCategory = product.subcategory?.toLowerCase() || "";
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        
        if (selectedCategory === "skincare") {
          const skincareKeywords = ['skin', 'cream', 'lotion', 'serum', 'moisturizer', 'toner', 'cleanser', 'scrub', 'mask', 'sunscreen'];
          return skincareKeywords.some(keyword => 
            category.includes(keyword) || 
            subCategory.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedCategory === "makeup") {
          const makeupKeywords = ['makeup', 'lipstick', 'foundation', 'concealer', 'powder', 'blush', 'eyeshadow', 'eyeliner', 'mascara'];
          return makeupKeywords.some(keyword => 
            category.includes(keyword) || 
            subCategory.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedCategory === "haircare") {
          const haircareKeywords = ['hair', 'shampoo', 'conditioner', 'hair oil', 'hair mask', 'hair serum'];
          return haircareKeywords.some(keyword => 
            category.includes(keyword) || 
            subCategory.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedCategory === "fragrance") {
          const fragranceKeywords = ['fragrance', 'perfume', 'deo', 'deodorant', 'body spray'];
          return fragranceKeywords.some(keyword => 
            category.includes(keyword) || 
            subCategory.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedCategory === "wellness") {
          const wellnessKeywords = ['wellness', 'health', 'supplement', 'vitamin', 'ayurveda', 'herbal'];
          return wellnessKeywords.some(keyword => 
            category.includes(keyword) || 
            subCategory.includes(keyword) ||
            tags.includes(keyword)
          );
        }
        
        return category.includes(selectedCategory) || 
               subCategory.includes(selectedCategory) ||
               tags.includes(selectedCategory);
      });
    }
    
    // Concern filter
    if (selectedConcern !== "all") {
      filtered = filtered.filter(product => {
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        const description = product.description?.toLowerCase() || "";
        const name = product.name?.toLowerCase() || "";
        
        if (selectedConcern === "acne") {
          const acneKeywords = ['acne', 'pimple', 'blemish', 'breakout', 'anti-acne'];
          return acneKeywords.some(keyword => 
            description.includes(keyword) || 
            name.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedConcern === "aging") {
          const agingKeywords = ['aging', 'anti-aging', 'wrinkle', 'fine lines', 'firming'];
          return agingKeywords.some(keyword => 
            description.includes(keyword) || 
            name.includes(keyword) ||
            tags.includes(keyword)
          );
        } else if (selectedConcern === "hydration") {
          const hydrationKeywords = ['hydration', 'hydrating', 'moisture', 'moisturizing', 'dry skin'];
          return hydrationKeywords.some(keyword => 
            description.includes(keyword) || 
            name.includes(keyword) ||
            tags.includes(keyword)
          );
        }
        
        return description.includes(selectedConcern) || 
               name.includes(selectedConcern) ||
               tags.includes(selectedConcern);
      });
    }
    
    // Skin type filter
    if (skinType !== "all") {
      filtered = filtered.filter(product => {
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        const description = product.description?.toLowerCase() || "";
        
        return description.includes(skinType) || 
               tags.includes(skinType) ||
               product.skinType?.toLowerCase().includes(skinType);
      });
    }
    
    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => 
        product.brand?.toLowerCase().includes(selectedBrand)
      );
    }
    
    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.price || product.finalPrice || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedConcern, selectedBrand, skinType, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedConcern("all");
    setSelectedBrand("all");
    setSkinType("all");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("newest");
    setShowFilters(false);
  };

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();
      if (res.ok) {
        const productsArray = data.products || data;
        const beautyProducts = productsArray.filter(product => {
          const category = product.category?.toLowerCase();
          const keywords = ['beauty', 'skincare', 'makeup', 'cosmetic', 'hair', 'wellness'];
          return keywords.some(keyword => category?.includes(keyword));
        });
        setProducts(beautyProducts);
        setFilteredProducts(beautyProducts);
        setMessage("");
      } else {
        setMessage(data.message || "Failed to refresh products.");
      }
    } catch (err) {
      setMessage("Error refreshing products.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeSelect = (range) => {
    setPriceRange({ min: range.min, max: range.max });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 flex justify-center items-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-pink-600 font-semibold text-base md:text-lg">Loading beauty collection...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-pink-500 mx-auto mb-3 md:mb-4" />
          <p className="text-pink-500 font-semibold text-base md:text-lg mb-3 md:mb-4">{message}</p>
          <button
            onClick={refreshProducts}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-400 hover:to-purple-400 transition-all shadow-lg text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
   <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkle className="w-5 h-5 text-pink-500" />
            <span className="text-pink-600 font-medium">Beauty & Wellness Collection</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Beauty Store
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
            Discover skincare, makeup, haircare & wellness products for your radiant beauty
          </p>
        </motion.div>

        {/* Beauty Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              label: "Total Products", 
              value: products.length, 
              icon: <Sparkle className="w-5 h-5" />,
              color: "from-pink-100 to-pink-100",
              iconColor: "text-pink-500"
            },
            { 
              label: "On Sale", 
              value: products.filter(p => p.discount > 0).length, 
              icon: <Tag className="w-5 h-5" />,
              color: "from-purple-100 to-purple-100",
              iconColor: "text-purple-500"
            },
            { 
              label: "Natural & Organic", 
              value: products.filter(p => p.tags?.includes('organic') || p.tags?.includes('natural')).length || Math.floor(products.length * 0.4), 
              icon: <Leaf className="w-5 h-5" />,
              color: "from-pink-100 to-purple-100",
              iconColor: "text-pink-500"
            },
            { 
              label: "Top Rated", 
              value: products.filter(p => p.rating >= 4).length || Math.floor(products.length * 0.3), 
              icon: <Star className="w-5 h-5" />,
              color: "from-purple-100 to-pink-100",
              iconColor: "text-purple-500"
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color} border border-gray-200`}>
                  <div className={stat.iconColor}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mobile Header & Search */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Beauty Products</h2>
                <p className="text-sm text-gray-600">{filteredProducts.length} items available</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search skincare, makeup, haircare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-900 placeholder-gray-500 text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Search and Filters Bar */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by product, concern, or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-900 placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl flex items-center gap-2 text-gray-700 transition-colors text-sm"
                  >
                    <Sliders className="w-5 h-5" />
                    Filters
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl border border-gray-300 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "grid" 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "list" 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-4 border-t border-gray-300/30">
                      {/* Category & Concern Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Category Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                              <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  selectedCategory === category.value
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {category.icon}
                                {category.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Concern Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Concern
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {concerns.map(concern => (
                              <button
                                key={concern.value}
                                onClick={() => setSelectedConcern(concern.value)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  selectedConcern === concern.value
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {concern.icon}
                                {concern.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Brand
                          </label>
                          <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                          >
                            {brands.map(brand => (
                              <option key={brand.value} value={brand.value}>{brand.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Skin Type & Price Range Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Skin Type Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Skin Type
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {skinTypes.map(type => (
                              <button
                                key={type.value}
                                onClick={() => setSkinType(type.value)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  skinType === type.value
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {type.icon}
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price Range Filters */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Price Range
                          </label>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {priceRanges.map((range, index) => (
                              <button
                                key={index}
                                onClick={() => handlePriceRangeSelect(range)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  priceRange.min === range.min && priceRange.max === range.max
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100000"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              रू {priceRange.min.toLocaleString()} - रू {priceRange.max.toLocaleString()}
                            </div>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100000"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sort and Reset */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                          >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="popular">Most Popular</option>
                            <option value="discount">Highest Discount</option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                            Reset All Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isMobile && showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-end"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Beauty Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map(category => (
                        <button
                          key={category.value}
                          onClick={() => setSelectedCategory(category.value)}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                            selectedCategory === category.value
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.icon}
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concern Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Concern</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {concerns.slice(0, 8).map(concern => (
                        <button
                          key={concern.value}
                          onClick={() => setSelectedConcern(concern.value)}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                            selectedConcern === concern.value
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {concern.icon}
                          {concern.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Type Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Skin Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {skinTypes.map(type => (
                        <button
                          key={type.value}
                          onClick={() => setSkinType(type.value)}
                          className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                            skinType === type.value
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {type.icon}
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {brands.slice(0, 6).map(brand => (
                        <button
                          key={brand.value}
                          onClick={() => setSelectedBrand(brand.value)}
                          className={`px-3 py-2.5 rounded-lg text-sm transition-all ${
                            selectedBrand === brand.value
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {brand.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => handlePriceRangeSelect(range)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            priceRange.min === range.min && priceRange.max === range.max
                              ? 'bg-pink-50 text-pink-700 border border-pink-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{range.label}</span>
                            {priceRange.min === range.min && priceRange.max === range.max && (
                              <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {["newest", "price-low", "price-high", "rating", "popular", "discount"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            sortBy === option
                              ? 'bg-pink-50 text-pink-700 border border-pink-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {option === "newest" && "Newest First"}
                              {option === "price-low" && "Price: Low to High"}
                              {option === "price-high" && "Price: High to Low"}
                              {option === "rating" && "Top Rated"}
                              {option === "popular" && "Most Popular"}
                              {option === "discount" && "Highest Discount"}
                            </span>
                            {sortBy === option && (
                              <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={resetFilters}
                        className="py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== "all" || selectedConcern !== "all" || selectedBrand !== "all" || skinType !== "all" || priceRange.min > 0 || priceRange.max < 100000) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchTerm && (
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-pink-900 p-1 rounded-full hover:bg-pink-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedCategory !== "all" && (
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm flex items-center gap-1">
                  {categories.find(c => c.value === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-pink-900 p-1 rounded-full hover:bg-pink-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedConcern !== "all" && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm flex items-center gap-1">
                  {concerns.find(c => c.value === selectedConcern)?.label}
                  <button onClick={() => setSelectedConcern("all")} className="hover:text-purple-900 p-1 rounded-full hover:bg-purple-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {skinType !== "all" && (
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm flex items-center gap-1">
                  {skinTypes.find(s => s.value === skinType)?.label}
                  <button onClick={() => setSkinType("all")} className="hover:text-pink-900 p-1 rounded-full hover:bg-pink-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedBrand !== "all" && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm flex items-center gap-1">
                  {brands.find(b => b.value === selectedBrand)?.label}
                  <button onClick={() => setSelectedBrand("all")} className="hover:text-purple-900 p-1 rounded-full hover:bg-purple-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {(priceRange.min > 0 || priceRange.max < 100000) && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 rounded-lg text-sm flex items-center gap-1">
                  Price: रू{priceRange.min.toLocaleString()} - रू{priceRange.max.toLocaleString()}
                  <button onClick={() => setPriceRange({ min: 0, max: 100000 })} className="hover:text-gray-900 p-1 rounded-full hover:bg-gray-50">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 hover:bg-gray-100 rounded-lg px-2 py-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            </div>
          </motion.div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm md:text-base">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-bold text-gray-900">{products.length}</span> beauty products
            {searchTerm && (
              <span className="text-pink-600"> for "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* View Mode Toggle (Mobile) */}
        {isMobile && (
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm ${
                  viewMode === "grid"
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm ${
                  viewMode === "list"
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low</option>
              <option value="price-high">Price: High</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <Sparkle className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Beauty Products Found</h3>
            <p className="text-gray-600 mb-6 px-4">
              {searchTerm || selectedCategory !== "all" || selectedConcern !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No beauty products available at the moment."}
            </p>
            {(searchTerm || selectedCategory !== "all" || selectedConcern !== "all") && (
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-400 hover:to-purple-400 transition-all shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${
              viewMode === "grid"
                ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={viewMode === "list" && !isMobile ? "max-w-3xl mx-auto" : ""}
              >
                <ProductCard 
                  product={product} 
                  viewMode={viewMode}
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Beauty Tips Section */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 md:p-8 border border-pink-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Beauty Tips & Skincare Guides</h3>
                  <p className="text-gray-700">
                    Get expert beauty advice, skincare routines, and makeup tutorials for radiant skin.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/blog/beauty-tips")}
                    className="px-6 py-3 bg-white text-pink-600 rounded-xl font-medium hover:bg-gray-50 transition-all border border-pink-200"
                  >
                    Beauty Blog
                  </button>
                  <button
                    onClick={() => navigate("/skincare-routine")}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    Skincare Guide
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile Refresh Button */}
        {isMobile && (
          <button
            onClick={refreshProducts}
            className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
   
   
   </>
  );
}