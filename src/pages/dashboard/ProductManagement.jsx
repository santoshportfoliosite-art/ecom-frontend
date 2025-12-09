import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  TrendingUp,
  DollarSign,
  Hash,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Award
} from "lucide-react";

export default function ProductManagement() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    "Electronics",
    "Fashion", 
    "Home & Kitchen",
    "Beauty & Health",
    "Sports & Fitness",
    "Books",
    "Toys & Baby",
    "Automotive",
    "Groceries",
    "Pets"
  ];

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err.message);
      setMessage("Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      if (statusFilter === "in-stock") {
        filtered = filtered.filter(p => p.stock > 0);
      } else if (statusFilter === "out-of-stock") {
        filtered = filtered.filter(p => p.stock <= 0);
      } else if (statusFilter === "featured") {
        filtered = filtered.filter(p => p.isFeatured);
      }
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, products]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Product deleted successfully!");
        fetchProducts();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("❌ Server error deleting product.");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-200 font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-3">
              <Package className="w-8 h-8" />
              Product Management
            </h1>
            <p className="text-emerald-200/70 mt-2">
              {products.length} products • {filteredProducts.filter(p => p.stock > 0).length} in stock
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/dashboard/add-product"}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200/70 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-emerald-300">{products.length}</p>
              </div>
              <Package className="w-10 h-10 text-emerald-500/30" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200/70 text-sm">In Stock</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {products.filter(p => p.stock > 0).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-500/30" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200/70 text-sm">Featured</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {products.filter(p => p.isFeatured).length}
                </p>
              </div>
              <Award className="w-10 h-10 text-emerald-500/30" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200/70 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-emerald-300">
                  ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-500/30" />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  placeholder="Search products by name, description, or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-900/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-900/50 border border-teal-800/30 rounded-xl p-3 pl-11 appearance-none text-white focus:outline-none focus:border-teal-500 transition-all min-w-[160px]"
                >
                  <option value="all" className="bg-gray-900">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900/50 border border-emerald-800/30 rounded-xl p-3 appearance-none text-white focus:outline-none focus:border-emerald-500 transition-all min-w-[140px]"
              >
                <option value="all" className="bg-gray-900">All Status</option>
                <option value="in-stock" className="bg-gray-900">In Stock</option>
                <option value="out-of-stock" className="bg-gray-900">Out of Stock</option>
                <option value="featured" className="bg-gray-900">Featured</option>
              </select>

              <div className="flex bg-gray-900/50 border border-emerald-800/30 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-900/30'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:bg-emerald-900/30'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
              message.includes("✅")
                ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                : "bg-red-900/30 border-red-800 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.includes("✅") ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="font-medium">{message}</span>
            </div>
          </motion.div>
        )}

        {/* Products Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 overflow-hidden hover:border-emerald-700/50 transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                      product.stock > 0 
                        ? 'bg-emerald-900/80 text-emerald-300' 
                        : 'bg-red-900/80 text-red-300'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-emerald-200 truncate">{product.name}</h3>
                      <div className="text-emerald-300 font-bold">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-emerald-200/70 mb-3">
                      <span className="bg-emerald-900/30 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      {product.sku && (
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {product.sku}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-emerald-200/70 mb-4 line-clamp-2">
                      {product.description || "No description available"}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = `/dashboard/edit-product/${product._id}`}
                        className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-800/30 rounded-lg p-2 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-900/30 hover:bg-red-800/40 text-red-300 border border-red-800/30 rounded-lg p-2 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-emerald-500/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-300 mb-2">No Products Found</h3>
                <p className="text-emerald-200/70">
                  {search ? "Try adjusting your search or filters" : "Start by adding your first product"}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50">
                  <tr>
                    <th className="p-4 text-left text-emerald-300 font-semibold">Product</th>
                    <th className="p-4 text-left text-emerald-300 font-semibold">Category</th>
                    <th className="p-4 text-left text-emerald-300 font-semibold">Price</th>
                    <th className="p-4 text-left text-emerald-300 font-semibold">Stock</th>
                    <th className="p-4 text-left text-emerald-300 font-semibold">Status</th>
                    <th className="p-4 text-center text-emerald-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product._id} className="border-b border-emerald-800/20 hover:bg-emerald-900/10 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]?.url || "https://via.placeholder.com/50"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <div className="font-medium text-emerald-200">{product.name}</div>
                              <div className="text-xs text-emerald-200/70">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-emerald-200">{product.category}</td>
                        <td className="p-4">
                          <div className="text-emerald-300 font-bold">${parseFloat(product.price).toFixed(2)}</div>
                          {product.discount > 0 && (
                            <div className="text-xs text-teal-400">-{product.discount}%</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                            product.stock > 0 
                              ? 'bg-emerald-900/30 text-emerald-300' 
                              : 'bg-red-900/30 text-red-300'
                          }`}>
                            {product.stock} units
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {product.isFeatured && (
                              <span className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-1 rounded-full w-fit">
                                Featured
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                              product.isActive 
                                ? 'bg-emerald-900/30 text-emerald-300' 
                                : 'bg-red-900/30 text-red-300'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => window.location.href = `/dashboard/edit-product/${product._id}`}
                              className="bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-800/30 rounded-lg p-2 transition-colors flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-900/30 hover:bg-red-800/40 text-red-300 border border-red-800/30 rounded-lg p-2 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-8">
                        <div className="flex flex-col items-center gap-3">
                          <Package className="w-12 h-12 text-emerald-500/30" />
                          <p className="text-emerald-200/70 font-medium">No products found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-emerald-800/30 p-4">
            <div className="text-sm text-emerald-200/70">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                        : 'text-emerald-300 hover:bg-emerald-900/30'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}