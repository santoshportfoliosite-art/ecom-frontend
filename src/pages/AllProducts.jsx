// AllProducts.jsx - Updated with green-blue color theme
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Smartphone,
} from "lucide-react";
import useSEO from "../hooks/useSEO";

export default function AllProducts() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState(["all"]);
  const [isMobile, setIsMobile] = useState(false);
const seo = useSEO("allproducts");
  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode("grid"); // Force grid view on mobile
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();
        if (res.ok) {
          const productsArray = data.products || data;
          setProducts(productsArray);
          setFilteredProducts(productsArray);
          
          const uniqueCategories = ["all"];
          productsArray.forEach(product => {
            if (product.category && !uniqueCategories.includes(product.category)) {
              uniqueCategories.push(product.category);
            }
          });
          setCategories(uniqueCategories);
        } else {
          setMessage(data.message || "Failed to load products.");
        }
      } catch (err) {
        setMessage("Error loading products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

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
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
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
        setProducts(productsArray);
        setFilteredProducts(productsArray);
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

  if (loading) {
    return (

      <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 flex justify-center items-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-green-600 font-semibold text-base md:text-lg">Loading products...</p>
        </div>
      </div></>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-accent-red mx-auto mb-3 md:mb-4" />
          <p className="text-accent-red font-semibold text-base md:text-lg mb-3 md:mb-4">{message}</p>
          <button
            onClick={refreshProducts}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all shadow-lg text-sm md:text-base"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                <p className="text-sm text-gray-600">{filteredProducts.length} products available</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900 placeholder-gray-500 text-base"
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

        {/* Desktop Header */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium">Complete Collection</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
              All Products
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
              Browse our complete collection of premium products
            </p>
          </motion.div>
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
                    placeholder="Search products by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900 placeholder-gray-500"
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
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "list" 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
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
                    <div className="pt-6 mt-4 border-t border-gray-300/30 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                selectedCategory === category
                                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {category === "all" ? "All Categories" : category}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Sort By
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                        >
                          <option value="newest">Newest First</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Top Rated</option>
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
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-2.5 rounded-lg text-sm transition-all ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category === "all" ? "All" : category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {["newest", "price-low", "price-high", "rating"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            sortBy === option
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              {option === "newest" && "Newest First"}
                              {option === "price-low" && "Price: Low to High"}
                              {option === "price-high" && "Price: High to Low"}
                              {option === "rating" && "Top Rated"}
                            </span>
                            {sortBy === option && (
                              <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
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
                        className="py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600"
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

        {/* Active Filters (Mobile) */}
        {isMobile && (searchTerm || selectedCategory !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-green-900 p-1 rounded-full hover:bg-green-50">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="hover:text-blue-900 p-1 rounded-full hover:bg-blue-50">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm md:text-base">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-bold text-gray-900">{products.length}</span> products
            {searchTerm && (
              <span className="text-green-600"> for "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6 px-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No products available at the moment."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* View Mode Toggle (Mobile) */}
            {isMobile && (
              <div className="flex items-center justify-end mb-4">
                <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      viewMode === "grid"
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-md text-sm ${
                      viewMode === "list"
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
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
          </>
        )}
      </div>
    </div></>
  );
}