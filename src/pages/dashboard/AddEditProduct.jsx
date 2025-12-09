import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Upload, 
  Tag, 
  Layers, 
  DollarSign, 
  Hash, 
  Building,
  Image as ImageIcon,
  Search,
  Settings,
  Plus,
  X,
  Save,
  ArrowLeft,
  Award,
  Globe
} from "lucide-react";

export default function AddEditProduct() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discount: 0,
    stock: "",
    sku: "",
    brand: "",
    attributes: [],
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    metaKeywords: "",
    tags: "",
    featuredKeywords: "",
    isFeatured: false,
    isActive: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState("");
  const [newAttr, setNewAttr] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const categories = {
    Electronics: ["Mobiles", "Laptops", "Accessories", "Audio", "Gaming"],
    Fashion: ["Men", "Women", "Kids", "Footwear", "Accessories"],
    "Home & Kitchen": ["Furniture", "Appliances", "Decor", "Cookware"],
    "Beauty & Health": ["Skincare", "Makeup", "Haircare", "Wellness"],
    "Sports & Fitness": ["Gym Equipment", "Activewear", "Accessories"],
    Books: ["Fiction", "Non-Fiction", "Educational", "Comics"],
    "Toys & Baby": ["Toys", "Baby Care", "Strollers"],
    Automotive: ["Car Accessories", "Bike Parts", "Oils"],
    Groceries: ["Fruits", "Vegetables", "Snacks", "Drinks"],
    Pets: ["Food", "Toys", "Health"],
  };

  // 🔍 Load product if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetch(`${backendUrl}/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setForm({
              ...data.product,
              metaKeywords: data.product.metaKeywords?.join(", ") || "",
              tags: data.product.tags?.join(", ") || "",
              featuredKeywords:
                data.product.featuredKeywords?.join(", ") || "",
            });
            setExistingImages(data.product.images || []);
          }
        })
        .catch(() => setMessage("Error loading product."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addAttribute = () => {
    if (newAttr.key && newAttr.value) {
      setForm({
        ...form,
        attributes: [...form.attributes, newAttr],
      });
      setNewAttr({ key: "", value: "" });
    }
  };

  const removeAttribute = (index) => {
    const updated = [...form.attributes];
    updated.splice(index, 1);
    setForm({ ...form, attributes: updated });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setNewImages(files);
  };

  const removeImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) formData.append(k, JSON.stringify(v));
      else formData.append(k, v);
    });

    for (const img of newImages) {
      formData.append("images", img);
    }

    try {
      const res = await fetch(
        `${backendUrl}/api/products${isEdit ? `/${id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Product saved successfully!");
        setTimeout(() => (window.location.href = "/dashboard/products"), 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("❌ Error saving product:", error.message);
      setMessage("Server error while saving product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-200 font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = "/dashboard/products"}
            className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-emerald-200/70">
                {isEdit ? "Update product details" : "Create a new product listing"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-emerald-800/30">
            <div className="flex overflow-x-auto">
              {["basic", "attributes", "images", "seo", "advanced"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "text-emerald-300 border-b-2 border-emerald-500"
                      : "text-emerald-200/70 hover:text-emerald-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`m-6 p-4 rounded-xl border backdrop-blur-sm ${
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-6">
            {/* BASIC INFO TAB */}
            {activeTab === "basic" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Product Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter detailed description"
                      rows="4"
                      required
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 appearance-none text-white focus:outline-none focus:border-emerald-500 transition-all"
                      >
                        <option value="" className="bg-gray-900">Select Category</option>
                        {Object.keys(categories).map((cat) => (
                          <option key={cat} value={cat} className="bg-gray-900">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Subcategory
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                      <select
                        name="subcategory"
                        value={form.subcategory}
                        onChange={handleChange}
                        disabled={!form.category}
                        className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pl-11 appearance-none text-white focus:outline-none focus:border-teal-500 transition-all disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-900">Select Subcategory</option>
                        {form.category &&
                          categories[form.category]?.map((sub) => (
                            <option key={sub} value={sub} className="bg-gray-900">
                              {sub}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Brand
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="Brand name"
                        className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      SKU
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                      <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Product SKU"
                        className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pl-11 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        required
                        className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Discount (%)
                    </label>
                    <input
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="0"
                      type="number"
                      min="0"
                      max="100"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Stock *
                    </label>
                    <input
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="Quantity"
                      type="number"
                      required
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ATTRIBUTES TAB */}
            {activeTab === "attributes" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Product Attributes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Attribute Key
                    </label>
                    <input
                      placeholder="e.g., Size, Color, Material"
                      value={newAttr.key}
                      onChange={(e) => setNewAttr({ ...newAttr, key: e.target.value })}
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Value
                    </label>
                    <input
                      placeholder="e.g., Large, Red, Cotton"
                      value={newAttr.value}
                      onChange={(e) => setNewAttr({ ...newAttr, value: e.target.value })}
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={addAttribute}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Attribute
                    </motion.button>
                  </div>
                </div>

                {/* Attributes List */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-emerald-200 mb-3">Current Attributes</h4>
                  {form.attributes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {form.attributes.map((attr, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold text-emerald-300">{attr.key}</div>
                            <div className="text-emerald-200/70 text-sm">{attr.value}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-emerald-900/10 rounded-xl border border-dashed border-emerald-800/30">
                      <Settings className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
                      <p className="text-emerald-200/70">No attributes added yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* IMAGES TAB */}
            {activeTab === "images" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Product Images
                </h3>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-emerald-200 mb-3">Existing Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((img, i) => (
                        <div key={i} className="bg-gray-900/50 rounded-xl p-3 border border-emerald-800/30">
                          <img
                            src={img.url}
                            alt="existing"
                            className="w-full h-40 object-cover rounded-lg mb-2"
                          />
                          <div className="text-xs text-emerald-200/70">
                            Index: {img.index !== undefined ? img.index : i}
                          </div>
                          {img.url && (
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-emerald-400 hover:text-emerald-300 truncate mt-1"
                            >
                              View Full Size
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-200 mb-3">Upload New Images (Max 3)</h4>
                  <div className="border-2 border-dashed border-emerald-800/50 rounded-2xl p-8 text-center">
                    <Upload className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      Choose Images
                    </label>
                    <p className="text-sm text-emerald-200/50 mt-3">
                      Supports: JPG, PNG, WebP • Max 5MB per image
                    </p>
                  </div>

                  {/* New Images Preview */}
                  {newImages.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-md font-medium text-emerald-200 mb-3">New Images Preview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {newImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt="preview"
                              className="w-full h-40 object-cover rounded-xl border-2 border-emerald-800/50"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="text-center mt-2">
                              <div className="text-xs text-emerald-300 bg-emerald-900/30 rounded-full px-2 py-1 inline-block">
                                Index: {i}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SEO TAB */}
            {activeTab === "seo" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO & Metadata
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      SEO Title
                    </label>
                    <input
                      name="seoTitle"
                      value={form.seoTitle}
                      onChange={handleChange}
                      placeholder="Optimized title for search engines"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={form.seoDescription}
                      onChange={handleChange}
                      placeholder="Meta description for search results"
                      rows="3"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Canonical URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                      <input
                        name="canonicalUrl"
                        value={form.canonicalUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/product-url"
                        className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pl-11 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      name="metaKeywords"
                      value={form.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Featured Keywords
                    </label>
                    <input
                      name="featuredKeywords"
                      value={form.featuredKeywords}
                      onChange={handleChange}
                      placeholder="main, important, keywords"
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADVANCED TAB */}
            {activeTab === "advanced" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-emerald-300 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-emerald-300 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Product Flags
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border ${form.isFeatured ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-400/50'}`}>
                            {form.isFeatured && (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                ✓
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-emerald-200">Featured Product</div>
                            <div className="text-sm text-emerald-200/70">Show in featured sections</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={form.isFeatured}
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border ${form.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-red-400/50'}`}>
                            {form.isActive && (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                ✓
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-emerald-200">Active Status</div>
                            <div className="text-sm text-emerald-200/70">
                              {form.isActive ? "Product is visible" : "Product is hidden"}
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={form.isActive}
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-emerald-300 mb-4">Product Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-emerald-200/70">Category</span>
                        <span className="text-emerald-300 font-medium">{form.category || "Not set"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-200/70">Stock</span>
                        <span className={`font-medium ${form.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {form.stock || 0} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-200/70">Price</span>
                        <span className="text-emerald-300 font-medium">
                          ${form.price || "0.00"}
                          {form.discount > 0 && (
                            <span className="text-teal-400 ml-2">
                              (-{form.discount}%)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-200/70">Attributes</span>
                        <span className="text-emerald-300 font-medium">{form.attributes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-200/70">Images</span>
                        <span className="text-emerald-300 font-medium">
                          {existingImages.length + newImages.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-emerald-800/30">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab(prev => prev === "basic" ? "basic" : ["basic", "attributes", "images", "seo", "advanced"][["basic", "attributes", "images", "seo", "advanced"].indexOf(prev) - 1])}
                  className="px-6 py-2.5 border border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/30 rounded-xl transition-colors"
                  disabled={activeTab === "basic"}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(prev => prev === "advanced" ? "advanced" : ["basic", "attributes", "images", "seo", "advanced"][["basic", "attributes", "images", "seo", "advanced"].indexOf(prev) + 1])}
                  className="px-6 py-2.5 border border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/30 rounded-xl transition-colors"
                  disabled={activeTab === "advanced"}
                >
                  Next
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEdit ? "Update Product" : "Create Product"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}