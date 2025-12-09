// src/components/OfferComponent.jsx — Final Responsive Version (Fully Synced with ProductCard)
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  Tag,
  Percent,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { colors } from "../theme/colors";

export default function OfferComponent() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch and filter discounted products
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();

        if (res.ok) {
          const productsArray = data.products || data;
          setProducts(productsArray);

          const discounted = productsArray.filter(
            (product) => product.discount && product.discount > 0
          );

          const sortedProducts = discounted.sort(
            (a, b) => (b.discount || 0) - (a.discount || 0)
          );

          setFilteredProducts(sortedProducts);
          
          // Show only first 3 products for home page
          setDisplayProducts(sortedProducts.slice(0, 3));

          if (sortedProducts.length === 0) {
            setError("No products with discounts available at the moment.");
          }
        } else {
          setError(data.message || "Failed to load products.");
        }
      } catch (err) {
        setError("Error loading discounted products.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [backendUrl]);

  // Refresh offers
  const refreshOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();

      if (res.ok) {
        const productsArray = data.products || data;
        setProducts(productsArray);

        const discounted = productsArray.filter(
          (product) => product.discount && product.discount > 0
        );

        const sortedProducts = discounted.sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );

        setFilteredProducts(sortedProducts);
        setDisplayProducts(sortedProducts.slice(0, 3));

        if (sortedProducts.length === 0) {
          setError("No products with discounts available at the moment.");
        }
      } else {
        setError(data.message || "Failed to refresh products.");
      }
    } catch (err) {
      setError("Error refreshing offers.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 text-center shadow-sm">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{
              borderColor: `${colors.green[200]} ${colors.green[200]} ${colors.green[200]} ${colors.green[500]}`,
            }}
          ></div>
          <p className="text-green-600 font-medium text-sm sm:text-base">
            Loading special offers...
          </p>
        </div>
      </div>
    );
  }

  if (error && filteredProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: colors.gray[100] }}
          >
            <AlertCircle className="w-6 h-6" style={{ color: colors.gray[400] }} />
          </div>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={refreshOffers}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition"
            style={{
              backgroundColor: colors.green[500],
              color: "white",
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Offers
          </button>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <Percent
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3"
            style={{ color: colors.gray[400] }}
          />
          <p className="text-gray-600 text-sm sm:text-base">
            No discount offers available at the moment.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Check back later for special deals!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: colors.green[100] }}
                >
                  <Tag className="w-4 h-4" style={{ color: colors.green[500] }} />
                </div>
                <span className="text-green-600 font-medium text-sm sm:text-base">
                  Limited Time Offers
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Special Discounts
              </h2>
              <p className="text-sm text-gray-600">
                Showing {displayProducts.length} of {filteredProducts.length} discounted products
              </p>
            </div>

            {/* View All Button */}
            {filteredProducts.length > 3 && (
              <Link
                to="/offers"
                className="flex items-center gap-2 font-medium group px-4 py-2 rounded-lg hover:shadow-sm transition-all text-sm sm:text-base whitespace-nowrap"
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
                View All Offers
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-5 sm:px-6 md:px-8 pb-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product, index) => (
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
        </div>

        {/* Gradient Border */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${colors.green[500]}, ${colors.blue[500]}, ${colors.green[500]})`,
            backgroundSize: "200% 100%",
            animation: "gradientShift 3s ease infinite",
          }}
        />
        <style>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}