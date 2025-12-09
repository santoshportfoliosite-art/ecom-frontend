import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Flame,
  Filter,
  ChevronDown,
  Star,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { colors } from "../theme/colors";
import axios from "axios";

// Use import.meta.env for Vite projects
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AllTrending = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [allProducts, sortBy, selectedCategory]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/products`);
      
      let products = [];
      
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      const transformedProducts = products
        .map(product => ({
          _id: product._id?.$oid || product._id,
          name: product.name,
          description: product.description,
          price: product.price?.$numberInt ? 
                 parseInt(product.price.$numberInt) : 
                 typeof product.price === 'number' ? product.price : 0,
          discount: product.discount?.$numberInt ? 
                   parseInt(product.discount.$numberInt) : 
                   typeof product.discount === 'number' ? product.discount : 0,
          images: product.images || [],
          brand: product.brand,
          isFeatured: product.isFeatured,
          stock: product.stock?.$numberInt ? 
                parseInt(product.stock.$numberInt) : 
                typeof product.stock === 'number' ? product.stock : 0,
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 0,
          category: product.category,
          tags: product.tags || [],
          createdAt: product.createdAt?.$date?.$numberLong ? 
                    parseInt(product.createdAt.$date.$numberLong) : 
                    product.createdAt || Date.now()
        }))
        .sort((a, b) => b.createdAt - a.createdAt); // Default sort by newest
      
      setAllProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      
    } catch (err) {
      console.error("Error fetching all products:", err);
      setError(err.response?.data?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    setFilteredProducts(filtered);
  };

  const getCategories = () => {
    const categories = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.accent.purple }} />
          <p className="text-gray-700 font-semibold">Loading all trending products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unable to load products</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAllProducts}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" style={{ color: colors.accent.purple }} />
              <h1 className="text-xl font-bold text-gray-900">All Trending Products</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {getCategories().map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Sort: {sortBy === "newest" ? "Newest" : 
                         sortBy === "rating" ? "Top Rated" :
                         sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => { setSortBy("newest"); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === "newest" ? "text-green-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => { setSortBy("rating"); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === "rating" ? "text-green-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      Top Rated
                    </button>
                    <button
                      onClick={() => { setSortBy("price-low"); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === "price-low" ? "text-green-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => { setSortBy("price-high"); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === "price-high" ? "text-green-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory !== "all" 
                ? `No products in "${selectedCategory}" category`
                : "No products available"
              }
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Badges */}
                  {index < 5 && (
                    <div 
                      className="absolute -top-2 -left-2 z-20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ 
                        backgroundColor: colors.accent.purple,
                        background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`
                      }}
                    >
                      NEW
                    </div>
                  )}
                  
                  {product.rating >= 4.5 && (
                    <div 
                      className="absolute -top-2 -right-2 z-20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1"
                      style={{ 
                        backgroundColor: colors.accent.amber,
                        background: `linear-gradient(135deg, ${colors.accent.amber}, ${colors.accent.red})`
                      }}
                    >
                      <Flame className="w-3 h-3" />
                      HOT
                    </div>
                  )}

                  {sortBy === "rating" && product.rating >= 4.7 && (
                    <div 
                      className="absolute top-10 -right-2 z-20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1"
                      style={{ 
                        backgroundColor: colors.green[600],
                        background: `linear-gradient(135deg, ${colors.green[600]}, ${colors.green[400]})`
                      }}
                    >
                      <Star className="w-3 h-3 fill-white" />
                      TOP RATED
                    </div>
                  )}
                  
                  <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{allProducts.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {getCategories().length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {allProducts.filter(p => p.rating >= 4.5).length}
                  </div>
                  <div className="text-sm text-gray-600">Highly Rated</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Back to Top */}
      <div className="h-8"></div>
    </div>
  );
};

export default AllTrending;