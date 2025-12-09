import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
 
} from "lucide-react";
import ProductCard from "./ProductCard";
import { colors } from "../theme/colors";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TopItems = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
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
        // If backend returns { products: [...] }
        products = response.data.products;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If backend returns { data: [...] }
        products = response.data.data;
      }
      
      // Transform and filter featured products
      const transformedProducts = products
        .filter(product => product.isFeatured === true)
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
          tags: product.tags || []
        }))
        .slice(0, 3); // Take only first 3
      
      setFeaturedProducts(transformedProducts);
      
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError(err.response?.data?.message || "Failed to load featured products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Featured Products */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" style={{ color: colors.green[500] }} />
                <span className="font-semibold" style={{ color: colors.green[600] }}>
                  Featured Products
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Today's Hot Picks
              </h2>
              <p className="text-gray-600 mt-1">
                Handpicked products just for you
              </p>
            </div>
            
            {!loading && featuredProducts.length > 0 && (
              <Link
                to="/products"
                className="flex items-center gap-2 font-medium group px-4 py-2 rounded-lg hover:shadow-sm transition-all"
                style={{
                  color: colors.green[600],
                  backgroundColor: colors.green[50],
                  border: `1px solid ${colors.green[200]}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.green[100];
                  e.currentTarget.style.color = colors.green[700];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.green[50];
                  e.currentTarget.style.color = colors.green[600];
                }}
              >
                View All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.green[500] }} />
              <span className="ml-3 text-gray-600">Loading featured products...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedProducts}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.green[500],
                  color: 'white'
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <Sparkles className="w-16 h-16" style={{ color: colors.gray[300] }} />
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">No Featured Products</h3>
              <p className="text-gray-600 mb-4">
                No featured products available at the moment.
              </p>
              <Link
                to="/products"
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.green[500],
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TopItems;