import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Sparkles, ChevronRight, Shirt } from "lucide-react";
import { colors } from "../theme/colors"; // ✅ Use centralized color palette

export default function FashionComponent() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFashionProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();

        if (res.ok) {
          const productsArray = data.products || data;

          const fashionKeywords = [
            "fashion",
            "clothing",
            "apparel",
            "wear",
            "shirt",
            "dress",
            "pants",
            "jeans",
            "t-shirt",
            "jacket",
            "coat",
            "skirt",
            "blouse",
            "sweater",
            "hoodie",
            "shoes",
            "footwear",
            "sneakers",
            "sandals",
            "boots",
            "accessory",
            "accessories",
            "jewelry",
            "watch",
            "bag",
            "handbag",
            "wallet",
            "belt",
            "scarf",
            "hat",
            "cap",
            "glasses",
            "sunglasses",
            "men",
            "women",
            "kids",
            "children",
            "unisex",
          ];

          const fashionProducts = productsArray.filter((product) => {
            const category = product.category?.toLowerCase();
            const name = product.name?.toLowerCase();
            const tags = product.tags?.map((tag) => tag.toLowerCase()) || [];
            return fashionKeywords.some(
              (keyword) =>
                category?.includes(keyword) ||
                name?.includes(keyword) ||
                tags.includes(keyword)
            );
          });

          const sortedProducts = fashionProducts
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);

          setProducts(sortedProducts);
        } else {
          setError(data.message || "Failed to load fashion products.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error loading fashion products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFashionProducts();
  }, [backendUrl]);

  // --- States ---

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 text-center">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-green-600 font-medium">Loading fashion picks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-red-500 font-bold">!</div>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 text-center">
          <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No fashion products available at the moment.</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium text-sm">Trending Now</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Fashion Collection
              </h2>
              <p className="text-gray-600">
                Discover the latest trends in clothing, footwear & accessories
              </p>
            </div>

            <button
              onClick={() => navigate("/fashion")}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl"
            >
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-6 md:px-8 pb-8">
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {index === 0 && (
                  <div
                    className="absolute -top-2 -right-2 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.green[500]}, ${colors.blue[500]})`,
                    }}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Trending
                  </div>
                )}
                <ProductCard
                  product={product}
                  viewMode="grid"
                  isMobile={false}
                  compact={true}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-8 md:hidden">
            <button
              onClick={() => navigate("/fashion")}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-400 hover:to-blue-400 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              View All Fashion Products
              <ChevronRight className="w-4 h-4" />
            </button>
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
