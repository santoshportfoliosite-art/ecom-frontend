import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Sparkle, ChevronRight, Heart, Star, Palette, Droplets } from "lucide-react";
import { colors } from "../theme/colors"; // ✅ Import your central color theme

export default function BeautyComponent() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBeautyProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();

        if (res.ok) {
          const productsArray = data.products || data;
          const beautyKeywords = [
            'beauty', 'cosmetic', 'skincare', 'skin care', 'makeup', 'make-up',
            'cosmetics', 'beauty product', 'facial', 'face', 'cream', 'lotion',
            'serum', 'moisturizer', 'toner', 'cleanser', 'wash', 'scrub',
            'mask', 'face mask', 'sheet mask', 'eye cream', 'lip care',
            'lipstick', 'lip gloss', 'lip balm', 'foundation', 'concealer',
            'powder', 'blush', 'bronzer', 'highlighter', 'eyeshadow', 'eyeliner',
            'mascara', 'kajal', 'eyebrow', 'nail polish', 'nail care', 'manicure',
            'hair', 'haircare', 'hair care', 'shampoo', 'conditioner', 'hair oil',
            'hair mask', 'hair serum', 'hair spray', 'hair gel', 'fragrance',
            'perfume', 'deo', 'deodorant', 'body spray', 'body lotion', 'body butter',
            'body wash', 'shower gel', 'soap', 'bath', 'bath salt', 'bath bomb',
            'wellness', 'health', 'supplement', 'vitamin', 'mineral', 'ayurveda',
            'ayurvedic', 'herbal', 'natural', 'organic', 'tool', 'brush', 'comb',
            'hair dryer', 'straightener', 'curler', 'trimmer', 'razor', 'shaver',
            'sunscreen', 'sunblock', 'spf', 'uv protection', 'tan', 'acne', 'pimple',
            'blemish', 'anti-aging', 'wrinkle', 'hydration', 'moisture', 'dry skin',
            'oily skin', 'combination', 'sensitive', 'brightening', 'glow', 'radiance',
            'hair fall', 'hair growth', 'dandruff', 'dry hair', 'oily scalp'
          ];

          const beautyProducts = productsArray.filter(product => {
            const category = product.category?.toLowerCase();
            const name = product.name?.toLowerCase();
            const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
            return beautyKeywords.some(keyword =>
              category?.includes(keyword) ||
              name?.includes(keyword) ||
              tags.includes(keyword)
            );
          });

          const sortedProducts = beautyProducts
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);

          setProducts(sortedProducts);
        } else {
          setError(data.message || "Failed to load beauty products.");
        }
      } catch (err) {
        setError("Error loading beauty products.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBeautyProducts();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl p-6 text-center">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-green-600 font-medium">Loading beauty essentials...</p>
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
          <Sparkle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No beauty products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Header Section */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkle className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium text-sm">Glow Essentials</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Beauty & Wellness
              </h2>
              <p className="text-gray-600">
                Discover skincare, makeup, haircare & wellness for radiant beauty
              </p>
            </div>

            <button
              onClick={() => navigate("/beauty")}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl"
            >
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Category Quick Links */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate("/beauty?category=skincare")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: colors.green[50],
                color: colors.green[600],
                border: `1px solid ${colors.green[200]}`
              }}
            >
              <Droplets className="w-4 h-4" />
              Skincare
            </button>
            <button
              onClick={() => navigate("/beauty?category=makeup")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: colors.blue[50],
                color: colors.blue[600],
                border: `1px solid ${colors.blue[200]}`
              }}
            >
              <Palette className="w-4 h-4" />
              Makeup
            </button>
            <button
              onClick={() => navigate("/beauty?category=haircare")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.green[50]}, ${colors.blue[50]})`,
                color: colors.blue[700],
                border: `1px solid ${colors.blue[200]}`
              }}
            >
              <Heart className="w-4 h-4" />
              Haircare
            </button>
            <button
              onClick={() => navigate("/beauty?category=wellness")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.blue[50]}, ${colors.green[50]})`,
                color: colors.green[700],
                border: `1px solid ${colors.green[200]}`
              }}
            >
              <Star className="w-4 h-4" />
              Wellness
            </button>
          </div>
        </div>

        {/* Products Section */}
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
                {product.tags?.includes('organic') && (
                  <div
                    className="absolute -top-2 -left-2 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: colors.accent.emerald }}
                  >
                    Organic
                  </div>
                )}

                {product.tags?.includes('new') && (
                  <div
                    className="absolute -top-2 -right-2 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.green[500]}, ${colors.blue[500]})`
                    }}
                  >
                    New
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
              onClick={() => navigate("/beauty")}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-400 hover:to-blue-400 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              View All Beauty Products
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Beauty Tips Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Beauty Tip of the Day
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {products.length > 0
                      ? `Did you know? ${products[0].name} works best when used as part of a complete skincare routine. Always follow with sunscreen during the day.`
                      : "Always apply sunscreen as the last step of your morning skincare routine for optimal protection."}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/blog/skincare-tips")}
                    className="px-4 py-2 border border-green-200 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-all text-sm"
                  >
                    Skincare Tips
                  </button>
                  <button
                    onClick={() => navigate("/beauty")}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-400 hover:to-blue-400 transition-all text-sm"
                  >
                    Shop All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Border Effect */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${colors.green[500]}, ${colors.blue[500]}, ${colors.green[500]})`,
            backgroundSize: "200% 100%",
            animation: "gradientShift 3s ease infinite"
          }}
        />
        <style >{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    </div>
  );
}
