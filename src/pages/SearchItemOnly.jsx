import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import {
  Search,
  X,
  PackageSearch,
  AlertCircle,
  Grid,
  List,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SearchItemsOnly() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const searchInputRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();
        if (res.ok) {
          const list = data.products || data;
          setProducts(list);
          // Show only first 3 products initially
          setFilteredProducts(list.slice(0, 3));
        } else {
          setMessage(data.message || "Failed to load products.");
        }
      } catch {
        setMessage("Error loading products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  // Search filtering - limited to 3 results
  useEffect(() => {
    if (!searchTerm.trim()) {
      // When no search term, show only first 3 products
      setFilteredProducts(products.slice(0, 3));
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(term))
    );

    // Limit to maximum 3 results for home page
    setFilteredProducts(filtered.slice(0, 3));
  }, [searchTerm, products]);

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Loading products...</p>
        </div>
      </div>
    );

  // Error state
  if (message)
    return (
      <div className="py-12">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-white py-6 px-4 md:py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <PackageSearch className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Quick Search</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-4">
            Product Finder
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
            Search across all products by name, category, or description
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products by name, category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent text-gray-900 placeholder-gray-500 text-base"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchTerm ? (
                <>
                  Showing <span className="font-semibold text-green-600">{filteredProducts.length}</span> of {products.filter(p => 
                    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).length} result{filteredProducts.length !== 1 ? 's' : ''}
                  {searchTerm && (
                    <> for "<span className="font-semibold text-gray-800">{searchTerm}"</span></>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of {products.length} products
                </>
              )}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid - MAX 3 */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No products match "${searchTerm}"`
                : "No products available"
              }
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-3xl mx-auto"
            }`}>
              <AnimatePresence mode="wait">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {index < 2 && (
                      <div 
                        className="absolute -top-2 -left-2 z-20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, #10b981, #3b82f6)`
                        }}
                      >
                        NEW
                      </div>
                    )}
                    
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* View All Button */}
            {((searchTerm && products.filter(p => 
              p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            ).length > 3) || (!searchTerm && products.length > 3)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-lg group"
                >
                  View All Results
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </>
        )}

        {/* Quick Categories */}
        {!searchTerm && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by category</h3>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(products.map(p => p.category).filter(Boolean)))
                .slice(0, 6)
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => setSearchTerm(category)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 text-gray-700 hover:text-green-700 rounded-lg font-medium transition-all hover:shadow-sm border border-gray-300 hover:border-green-300"
                  >
                    {category}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {/* Minimal bottom spacer */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}