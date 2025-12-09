import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  Star,
  Tag,
  CheckCircle,
  Filter,
  Grid,
  List,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import useSEO from "../hooks/useSEO";
const Featured = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const seo = useSEO("featured");
  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching products from:", `${backendUrl}/api/products`);

      const response = await fetch(`${backendUrl}/api/products`);

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API Response data:", data);

      // Handle different response formats
      let productsArray = [];

      if (Array.isArray(data)) {
        // If response is already an array
        productsArray = data;
      } else if (data && typeof data === "object") {
        // If response is an object with products array
        if (Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (Array.isArray(data.data)) {
          productsArray = data.data;
        } else if (Array.isArray(data.items)) {
          productsArray = data.items;
        } else if (data.success && Array.isArray(data.result)) {
          productsArray = data.result;
        } else {
          // Try to get the first array value from the object
          const arrayValues = Object.values(data).filter((val) =>
            Array.isArray(val)
          );
          if (arrayValues.length > 0) {
            productsArray = arrayValues[0];
          } else {
            console.error("No array found in response:", data);
            throw new Error(
              "Invalid response format: Could not find products array"
            );
          }
        }
      } else {
        console.error("Invalid response type:", typeof data);
        throw new Error("Invalid response format: Expected array or object");
      }

      console.log("Products array found:", productsArray.length, "items");

      if (!Array.isArray(productsArray)) {
        throw new Error("Products data is not an array");
      }

      // Filter only featured products (using isFeatured field from your DB)
      const featuredProducts = productsArray.filter((product) => {
        // Check if product exists and has isFeatured property set to true
        return product && product.isFeatured === true;
      });

      console.log("Featured products found:", featuredProducts.length);

      // If no featured products found, show all products
      if (featuredProducts.length === 0) {
        console.warn(
          "No featured products found. Showing all products instead."
        );
        // You could choose to show a message instead
        // setError("No featured products available at the moment.");
      }

      setProducts(featuredProducts);
      setFilteredProducts(featuredProducts);

      // Extract unique categories from featured products
      const categoryMap = new Map();
      featuredProducts.forEach((product) => {
        // Handle different category structures
        let categoryName = "Uncategorized";

        if (typeof product.category === "string") {
          categoryName = product.category;
        } else if (product.category && typeof product.category === "object") {
          categoryName =
            product.category.name || product.category.title || "Uncategorized";
        }

        const count = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, count + 1);
      });

      // Convert to array format for categories
      const categoryCounts = Array.from(categoryMap, ([id, count]) => ({
        id: id,
        name: id,
        count: count,
      }));

      // Sort categories by count (descending)
      categoryCounts.sort((a, b) => b.count - a.count);

      // Add "All Products" option at the beginning
      setCategories([
        { id: "all", name: "All Products", count: featuredProducts.length },
        ...categoryCounts,
      ]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load featured products: ${err.message}`);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendUrl]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        let productCategory = "";

        if (typeof product.category === "string") {
          productCategory = product.category;
        } else if (product.category && typeof product.category === "object") {
          productCategory =
            product.category.name || product.category.title || "";
        }

        return productCategory === selectedCategory;
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        // Assuming you might add rating field later
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "featured":
      default:
        // Already sorted by featured status
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  const handleAddToCart = (product) => {
    console.log("Adding to cart from Featured:", product);
    // Implement cart logic here
    alert(`${product.name} added to cart!`);
  };

  const calculateStats = () => {
    return {
      totalFeatured: products.length,
      averageRating:
        products.length > 0
          ? (
              products.reduce((sum, p) => sum + (p.rating || 4.5), 0) /
              products.length
            ).toFixed(1)
          : "0.0",
      onDiscount: products.filter((p) => p.discount && p.discount > 0).length,
      inStock: products.filter((p) => p.stock && p.stock > 0).length,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-green-600 font-semibold">
              Loading featured products...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-green-500" />
                  <span className="text-green-600 font-semibold">
                    FEATURED COLLECTION
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                  Premium Featured Products
                </h1>
                <p className="text-gray-600 mt-2">
                  Curated selection of our most exceptional products
                </p>
              </div>

              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 rounded-lg hover:from-green-500/20 hover:to-blue-500/20 border border-green-200 flex items-center gap-2 transition-colors self-start"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {error && (
              <div className="bg-gradient-to-br from-accent-red/10 to-accent-red/5 rounded-xl border border-accent-red/20 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0" />
                  <p className="text-accent-red text-sm">{error}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats Bar */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Featured Products</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalFeatured}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.averageRating}/5.0
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">On Discount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.onDiscount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">In Stock</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.inStock}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters and Controls */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-sm ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                      <span
                        className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                          selectedCategory === category.id
                            ? "bg-white/20"
                            : "bg-gray-100"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* View Mode and Sort */}
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg border border-gray-300 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900 appearance-none pr-8 text-sm"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="discount">Highest Discount</option>
                    </select>
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            {products.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No Featured Products Available
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  There are no featured products at the moment. Please check
                  back later or browse our full catalog.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button
                    onClick={() => (window.location.href = "/products")}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                  >
                    Browse All Products
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Products Match Your Filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try changing your category or filter settings.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSortBy("featured");
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        viewMode={viewMode}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        viewMode={viewMode}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Footer */}
          {filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-8 border-t border-gray-200"
            >
              <p className="text-gray-600 mb-2">
                Showing {filteredProducts.length} of {products.length} featured
                products
                {selectedCategory !== "all" &&
                  ` in "${selectedCategory}" category`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Featured Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700">On Discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-700">Out of Stock</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Featured;
