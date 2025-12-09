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
  Dumbbell,
  Footprints,
  Target,
  Trophy,
  Bike,
  Heart,
  Zap,
  Clock,
  Star,
  Flame,
  TrendingUp,
  Shield,
  Activity,
  ChevronRight,
} from "lucide-react";
import useSEO from "../hooks/useSEO";
export default function Sports() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const seo = useSEO("sports");
  // Sport categories
  const sportCategories = [
    { value: "all", label: "All Sports", icon: <Trophy className="w-4 h-4" /> },
    {
      value: "fitness",
      label: "Fitness",
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      value: "running",
      label: "Running",
      icon: <Footprints className="w-4 h-4" />,
    },
    { value: "cycling", label: "Cycling", icon: <Bike className="w-4 h-4" /> },
    {
      value: "yoga",
      label: "Yoga & Pilates",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      value: "team",
      label: "Team Sports",
      icon: <Target className="w-4 h-4" />,
    },
    { value: "outdoor", label: "Outdoor", icon: <Flame className="w-4 h-4" /> },
    {
      value: "water",
      label: "Water Sports",
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  // Product categories
  const categories = [
    { value: "all", label: "All Products", icon: <Tag className="w-4 h-4" /> },
    {
      value: "footwear",
      label: "Sports Shoes",
      icon: <Footprints className="w-4 h-4" />,
    },
    {
      value: "clothing",
      label: "Activewear",
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      value: "equipment",
      label: "Equipment",
      icon: <Target className="w-4 h-4" />,
    },
    {
      value: "accessories",
      label: "Accessories",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      value: "nutrition",
      label: "Nutrition",
      icon: <Flame className="w-4 h-4" />,
    },
    {
      value: "trackers",
      label: "Fitness Trackers",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      value: "recovery",
      label: "Recovery",
      icon: <Heart className="w-4 h-4" />,
    },
  ];

  // Popular sports brands
  const brands = [
    { value: "all", label: "All Brands" },
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "reebok", label: "Reebok" },
    { value: "underarmour", label: "Under Armour" },
    { value: "asics", label: "ASICS" },
    { value: "newbalance", label: "New Balance" },
    { value: "lululemon", label: "Lululemon" },
    { value: "gymshark", label: "Gymshark" },
    { value: "decathlon", label: "Decathlon" },
  ];

  // Price ranges
  const priceRanges = [
    { min: 0, max: 1000, label: "Under रू 1,000" },
    { min: 1000, max: 3000, label: "रू 1,000 - 3,000" },
    { min: 3000, max: 8000, label: "रू 3,000 - 8,000" },
    { min: 8000, max: 15000, label: "रू 8,000 - 15,000" },
    { min: 15000, max: 100000, label: "Over रू 15,000" },
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
    const fetchSportsProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();

        if (res.ok) {
          const productsArray = data.products || data;

          // Filter sports & fitness products
          const sportsProducts = productsArray.filter((product) => {
            const category = product.category?.toLowerCase();
            const name = product.name?.toLowerCase();
            const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];

            const sportsKeywords = [
              "sports",
              "sport",
              "fitness",
              "gym",
              "workout",
              "exercise",
              "running",
              "run",
              "jogging",
              "marathon",
              "athletic",
              "training",
              "trainer",
              "sneakers",
              "sports shoes",
              "athletic shoes",
              "activewear",
              "sportswear",
              "jersey",
              "shorts",
              "track",
              "tracksuit",
              "cycling",
              "bike",
              "bicycle",
              "cycling shoes",
              "helmet",
              "yoga",
              "pilates",
              "mat",
              "yoga mat",
              "meditation",
              "football",
              "soccer",
              "basketball",
              "cricket",
              "tennis",
              "badminton",
              "volleyball",
              "hockey",
              "baseball",
              "rugby",
              "swimming",
              "pool",
              "aqua",
              "water sports",
              "surfing",
              "hiking",
              "trekking",
              "camping",
              "outdoor",
              "adventure",
              "dumbbell",
              "weights",
              "barbell",
              "kettlebell",
              "equipment",
              "protein",
              "supplement",
              "nutrition",
              "health",
              "fitness tracker",
              "smartwatch",
              "heart rate",
              "monitor",
              "recovery",
              "massage",
              "foam roller",
              "compression",
            ];

            return sportsKeywords.some(
              (keyword) =>
                category?.includes(keyword) ||
                name?.includes(keyword) ||
                tags.includes(keyword)
            );
          });

          setProducts(sportsProducts);
          setFilteredProducts(sportsProducts);
        } else {
          setMessage(data.message || "Failed to load sports products.");
        }
      } catch (err) {
        setMessage("Error loading sports products.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsProducts();
  }, [backendUrl]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Sport category filter
    if (selectedSport !== "all") {
      filtered = filtered.filter((product) => {
        const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];
        const category = product.category?.toLowerCase() || "";
        const name = product.name?.toLowerCase() || "";

        if (selectedSport === "fitness") {
          const fitnessKeywords = [
            "fitness",
            "gym",
            "workout",
            "exercise",
            "weight",
            "dumbbell",
            "barbell",
          ];
          return fitnessKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              name.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedSport === "running") {
          const runningKeywords = [
            "running",
            "run",
            "jogging",
            "marathon",
            "sprint",
          ];
          return runningKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              name.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedSport === "cycling") {
          const cyclingKeywords = ["cycling", "bike", "bicycle", "cycle"];
          return cyclingKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              name.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedSport === "yoga") {
          const yogaKeywords = ["yoga", "pilates", "meditation", "stretch"];
          return yogaKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              name.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedSport === "team") {
          const teamKeywords = [
            "football",
            "soccer",
            "basketball",
            "cricket",
            "tennis",
            "volleyball",
            "hockey",
          ];
          return teamKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              name.includes(keyword) ||
              tags.includes(keyword)
          );
        }

        return (
          category.includes(selectedSport) ||
          name.includes(selectedSport) ||
          tags.includes(selectedSport)
        );
      });
    }

    // Product category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        const category = product.category?.toLowerCase() || "";
        const subCategory = product.subcategory?.toLowerCase() || "";
        const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];

        if (selectedCategory === "footwear") {
          const footwearKeywords = [
            "shoe",
            "sneaker",
            "footwear",
            "running shoe",
            "sports shoe",
          ];
          return footwearKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              subCategory.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedCategory === "clothing") {
          const clothingKeywords = [
            "activewear",
            "sportswear",
            "jersey",
            "shorts",
            "track",
            "t-shirt",
            "tshirt",
          ];
          return clothingKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              subCategory.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedCategory === "equipment") {
          const equipmentKeywords = [
            "equipment",
            "dumbbell",
            "weight",
            "barbell",
            "kettlebell",
            "mat",
          ];
          return equipmentKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              subCategory.includes(keyword) ||
              tags.includes(keyword)
          );
        } else if (selectedCategory === "nutrition") {
          const nutritionKeywords = [
            "protein",
            "supplement",
            "nutrition",
            "health",
            "energy",
          ];
          return nutritionKeywords.some(
            (keyword) =>
              category.includes(keyword) ||
              subCategory.includes(keyword) ||
              tags.includes(keyword)
          );
        }

        return (
          category.includes(selectedCategory) ||
          subCategory.includes(selectedCategory) ||
          tags.includes(selectedCategory)
        );
      });
    }

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) =>
        product.brand?.toLowerCase().includes(selectedBrand)
      );
    }

    // Price range filter
    filtered = filtered.filter((product) => {
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
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedSport,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSport("all");
    setSelectedCategory("all");
    setSelectedBrand("all");
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
        const sportsProducts = productsArray.filter((product) => {
          const category = product.category?.toLowerCase();
          const keywords = ["sports", "fitness", "gym", "running", "athletic"];
          return keywords.some((keyword) => category?.includes(keyword));
        });
        setProducts(sportsProducts);
        setFilteredProducts(sportsProducts);
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
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 flex justify-center items-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
            <p className="text-orange-600 font-semibold text-base md:text-lg">
              Loading sports collection...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-3 md:mb-4" />
          <p className="text-red-500 font-semibold text-base md:text-lg mb-3 md:mb-4">
            {message}
          </p>
          <button
            onClick={refreshProducts}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition-all shadow-lg text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/20 py-6 px-4 md:py-8 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">
                Sports & Fitness Collection
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Sports Store
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
              Gear up for performance with premium sports equipment, activewear
              & fitness essentials
            </p>
          </motion.div>

          {/* Sports Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: "Total Items",
                value: products.length,
                icon: <Dumbbell className="w-5 h-5" />,
                color: "from-orange-100 to-orange-100",
                iconColor: "text-orange-500",
              },
              {
                label: "On Sale",
                value: products.filter((p) => p.discount > 0).length,
                icon: <Tag className="w-5 h-5" />,
                color: "from-red-100 to-red-100",
                iconColor: "text-red-500",
              },
              {
                label: "Top Rated",
                value:
                  products.filter((p) => p.rating >= 4).length ||
                  Math.floor(products.length * 0.3),
                icon: <Star className="w-5 h-5" />,
                color: "from-orange-100 to-red-100",
                iconColor: "text-orange-500",
              },
              {
                label: "New Arrivals",
                value:
                  products.filter((p) => p.isNew).length ||
                  Math.floor(products.length * 0.2),
                icon: <Zap className="w-5 h-5" />,
                color: "from-red-100 to-orange-100",
                iconColor: "text-red-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${stat.color} border border-gray-200`}
                  >
                    <div className={stat.iconColor}>{stat.icon}</div>
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sports Products
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} items available
                  </p>
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
                  placeholder="Search sports equipment, activewear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 placeholder-gray-500 text-base"
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
                      placeholder="Search by sport, equipment, or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 placeholder-gray-500"
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
                      {showFilters ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl border border-gray-300 p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-all ${
                          viewMode === "grid"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-all ${
                          viewMode === "list"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
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
                        {/* Sport & Category Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          {/* Sport Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Sport Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {sportCategories.map((sport) => (
                                <button
                                  key={sport.value}
                                  onClick={() => setSelectedSport(sport.value)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    selectedSport === sport.value
                                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {sport.icon}
                                  {sport.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Category Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Product Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {categories.map((category) => (
                                <button
                                  key={category.value}
                                  onClick={() =>
                                    setSelectedCategory(category.value)
                                  }
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    selectedCategory === category.value
                                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {category.icon}
                                  {category.label}
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
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                            >
                              {brands.map((brand) => (
                                <option key={brand.value} value={brand.value}>
                                  {brand.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Price Range Filters */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Price Range
                          </label>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {priceRanges.map((range, index) => (
                              <button
                                key={index}
                                onClick={() => handlePriceRangeSelect(range)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  priceRange.min === range.min &&
                                  priceRange.max === range.max
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                                onChange={(e) =>
                                  setPriceRange((prev) => ({
                                    ...prev,
                                    min: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              रू {priceRange.min.toLocaleString()} - रू{" "}
                              {priceRange.max.toLocaleString()}
                            </div>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100000"
                                value={priceRange.max}
                                onChange={(e) =>
                                  setPriceRange((prev) => ({
                                    ...prev,
                                    max: parseInt(e.target.value),
                                  }))
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
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
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                            >
                              <option value="newest">Newest First</option>
                              <option value="price-low">
                                Price: Low to High
                              </option>
                              <option value="price-high">
                                Price: High to Low
                              </option>
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sports Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Sport Type Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Sport Type
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {sportCategories.map((sport) => (
                          <button
                            key={sport.value}
                            onClick={() => setSelectedSport(sport.value)}
                            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                              selectedSport === sport.value
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {sport.icon}
                            {sport.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Type Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Product Type
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                              selectedCategory === category.value
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {category.icon}
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {brands.slice(0, 6).map((brand) => (
                          <button
                            key={brand.value}
                            onClick={() => setSelectedBrand(brand.value)}
                            className={`px-3 py-2.5 rounded-lg text-sm transition-all ${
                              selectedBrand === brand.value
                                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {brand.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Price Range
                      </h4>
                      <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => handlePriceRangeSelect(range)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                              priceRange.min === range.min &&
                              priceRange.max === range.max
                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{range.label}</span>
                              {priceRange.min === range.min &&
                                priceRange.max === range.max && (
                                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
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
                      <h4 className="font-medium text-gray-900 mb-3">
                        Sort By
                      </h4>
                      <div className="space-y-2">
                        {[
                          "newest",
                          "price-low",
                          "price-high",
                          "rating",
                          "popular",
                          "discount",
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => setSortBy(option)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                              sortBy === option
                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                {option === "newest" && "Newest First"}
                                {option === "price-low" && "Price: Low to High"}
                                {option === "price-high" &&
                                  "Price: High to Low"}
                                {option === "rating" && "Top Rated"}
                                {option === "popular" && "Most Popular"}
                                {option === "discount" && "Highest Discount"}
                              </span>
                              {sortBy === option && (
                                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
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
                          className="py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600"
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
          {(searchTerm ||
            selectedSport !== "all" ||
            selectedCategory !== "all" ||
            selectedBrand !== "all" ||
            priceRange.min > 0 ||
            priceRange.max < 100000) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>

                {searchTerm && (
                  <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm flex items-center gap-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-orange-900 p-1 rounded-full hover:bg-orange-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSport !== "all" && (
                  <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm flex items-center gap-1">
                    {
                      sportCategories.find((s) => s.value === selectedSport)
                        ?.label
                    }
                    <button
                      onClick={() => setSelectedSport("all")}
                      className="hover:text-orange-900 p-1 rounded-full hover:bg-orange-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1">
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedBrand !== "all" && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1">
                    {brands.find((b) => b.value === selectedBrand)?.label}
                    <button
                      onClick={() => setSelectedBrand("all")}
                      className="hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(priceRange.min > 0 || priceRange.max < 100000) && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-gray-700 rounded-lg text-sm flex items-center gap-1">
                    Price: रू{priceRange.min.toLocaleString()} - रू
                    {priceRange.max.toLocaleString()}
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 100000 })}
                      className="hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                    >
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
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">{products.length}</span>{" "}
              sports products
              {searchTerm && (
                <span className="text-orange-600"> for "{searchTerm}"</span>
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
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md text-sm ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
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
              <Dumbbell className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Sports Products Found
              </h3>
              <p className="text-gray-600 mb-6 px-4">
                {searchTerm ||
                selectedSport !== "all" ||
                selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No sports products available at the moment."}
              </p>
              {(searchTerm ||
                selectedSport !== "all" ||
                selectedCategory !== "all") && (
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition-all shadow-lg"
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
                  className={
                    viewMode === "list" && !isMobile ? "max-w-3xl mx-auto" : ""
                  }
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

          {/* Sports Tips Section */}
          {filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 md:p-8 border border-orange-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Fitness Tips & Training Guides
                    </h3>
                    <p className="text-gray-700">
                      Get expert advice on training routines, nutrition tips,
                      and equipment maintenance.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/blog/fitness-tips")}
                      className="px-6 py-3 bg-white text-orange-600 rounded-xl font-medium hover:bg-gray-50 transition-all border border-orange-200"
                    >
                      Training Guides
                    </button>
                    <button
                      onClick={() => navigate("/nutrition-guide")}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      Nutrition Guide
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
              className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
