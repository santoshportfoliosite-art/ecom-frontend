import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Loader2,
  Flame,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { colors } from "../theme/colors";
import axios from "axios";

// Use import.meta.env for Vite projects
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Trending = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products from backend
      const response = await axios.get(`${API_URL}/products`);
      
      // Check if response.data is an array or has a different structure
      let products = [];
      
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }
      
      // Transform products and sort by creation date (newest first)
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
        // Sort by creation date (newest first)
        .sort((a, b) => b.createdAt - a.createdAt)
        // Take only first 3 products (MAX 3)
        .slice(0, 3);
      
      setTrendingProducts(transformedProducts);
      
    } catch (err) {
      console.error("Error fetching trending products:", err);
      setError(err.response?.data?.message || "Failed to load trending products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trending Products */}
      <section className="py-10 px-4 sm:px-6 lg:px-8" style={{ 
        background: `linear-gradient(to bottom, ${colors.gray[50]}, ${colors.blue[50]}30)` 
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: colors.accent.purple }} />
                <span className="font-semibold text-sm sm:text-base" style={{ color: colors.accent.purple }}>
                  Trending Now
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.gray[900] }}>
                Latest Products
              </h2>
              <p className="mt-1 text-sm sm:text-base" style={{ color: colors.gray[600] }}>
                Freshly added to our collection
              </p>
            </div>
            
            {!loading && trendingProducts.length > 0 && (
              <Link
                to="/products?sort=newest"
                className="flex items-center gap-2 font-medium group px-4 py-2 rounded-lg hover:shadow-sm transition-all text-sm sm:text-base whitespace-nowrap"
                style={{
                  color: colors.accent.purple,
                  backgroundColor: colors.blue[50],
                  border: `1px solid ${colors.blue[200]}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[100];
                  e.currentTarget.style.color = colors.accent.purple;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blue[50];
                  e.currentTarget.style.color = colors.accent.purple;
                }}
              >
                View All Latest
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.accent.purple }} />
              <span className="ml-3 text-sm sm:text-base" style={{ color: colors.gray[600] }}>Loading latest products...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-3" style={{ color: colors.accent.red }} />
              <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: colors.gray[900] }}>
                Unable to load products
              </h3>
              <p className="mb-4 text-sm sm:text-base" style={{ color: colors.gray[600] }}>{error}</p>
              <button
                onClick={fetchTrendingProducts}
                className="px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
                style={{
                  backgroundColor: colors.accent.purple,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent.purple;
                  e.currentTarget.style.filter = 'brightness(110%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent.purple;
                  e.currentTarget.style.filter = 'brightness(100%)';
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && trendingProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trendingProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* "New" badge for recently added products */}
                  {index < 2 && (
                    <div 
                      className="absolute -top-2 -left-2 z-20 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ 
                        backgroundColor: colors.accent.purple,
                        background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`
                      }}
                    >
                      NEW
                    </div>
                  )}
                  
                  {/* "Hot" badge for high-rated products */}
                  {product.rating >= 4.5 && (
                    <div 
                      className="absolute -top-2 -right-2 z-20 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1"
                      style={{ 
                        backgroundColor: colors.accent.amber,
                        background: `linear-gradient(135deg, ${colors.accent.amber}, ${colors.accent.red})`
                      }}
                    >
                      <Flame className="w-3 h-3" />
                      HOT
                    </div>
                  )}
                  
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && trendingProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6">
              <Flame className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: colors.gray[300] }} />
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2" style={{ color: colors.gray[900] }}>
                No Products Yet
              </h3>
              <p className="mb-4 text-sm sm:text-base" style={{ color: colors.gray[600] }}>
                No products have been added yet. Check back soon!
              </p>
              <Link
                to="/trending"
                className="px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
                style={{
                  backgroundColor: colors.accent.purple,
                  color: 'white',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent.purple;
                  e.currentTarget.style.filter = 'brightness(110%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent.purple;
                  e.currentTarget.style.filter = 'brightness(100%)';
                }}
              >
               All Trending
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Trending;