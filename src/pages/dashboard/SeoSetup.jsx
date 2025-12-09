// src/pages/dashboard/SeoSetup.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  FileText,
  Tag,
  Image,
  Link,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  RefreshCw,
  Eye,
  Copy,
  CheckCircle2,
  AlertCircle,
  Shield,
  TrendingUp,
  Target,
  BarChart3,
  Hash
} from "lucide-react";

export default function SeoSetup() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ page: "", title: "", description: "", keywords: "", image: "", url: "" });
  const [alert, setAlert] = useState({ type: "", message: "", show: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message, show: true });
    setTimeout(() => setAlert({ type: "", message: "", show: false }), 4000);
  };

  const fetchAll = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${backendUrl}/api/seo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Could not load SEO items");
      showAlert("error", "❌ Failed to load SEO items");
    } finally {
      setFetching(false);
    }
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({ 
      page: item.page, 
      title: item.title || "", 
      description: item.description || "", 
      keywords: item.keywords || "", 
      image: item.image || "", 
      url: item.url || "" 
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ page: "", title: "", description: "", keywords: "", image: "", url: "" });
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${backendUrl}/api/seo/${editing._id}` : `${backendUrl}/api/seo`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Request failed");
      }
      await fetchAll();
      resetForm();
      showAlert("success", editing ? "✅ SEO updated successfully" : "✅ SEO created successfully");
    } catch (err) {
      console.error(err);
      setError(err.message);
      showAlert("error", `❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this SEO entry?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/seo/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }
      await fetchAll();
      showAlert("success", "✅ SEO entry deleted successfully");
    } catch (err) {
      console.error(err);
      setError("Could not delete");
      showAlert("error", "❌ Failed to delete SEO entry");
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showAlert("success", `✅ ${type} copied to clipboard`);
  };

  const filteredItems = items.filter(item =>
    item.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur-lg opacity-50"></div>
            <div className="relative w-14 h-14 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 rounded-xl border border-emerald-600/50 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-emerald-100" />
            </div>
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent"
            >
              SEO Configuration
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-300/70 text-sm"
            >
              Optimize search engine visibility and page rankings
            </motion.p>
          </div>
        </motion.div>

        {/* SEO Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "Total Pages", value: items.length, icon: FileText, color: "from-emerald-900/30 to-teal-900/30" },
            { label: "Avg Title Length", value: "62 chars", icon: Hash, color: "from-teal-900/30 to-cyan-900/30" },
            { label: "Avg Description", value: "156 chars", icon: BarChart3, color: "from-emerald-900/30 to-green-900/30" },
            { label: "Optimized Pages", value: `${items.filter(i => i.title && i.description).length}`, icon: Target, color: "from-green-900/30 to-lime-900/30" }
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl border border-emerald-800/30 p-4 backdrop-blur-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-300/70">{stat.label}</p>
                  <p className="text-2xl font-bold text-emerald-300">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color.replace('900/30', '900/50')}`}>
                  <stat.icon className="w-5 h-5 text-emerald-300" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-gray-800/90 via-emerald-900/20 to-gray-900/90 rounded-2xl border border-emerald-800/30 backdrop-blur-xl overflow-hidden">
            {/* Form Header */}
            <div className="p-6 border-b border-emerald-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-800/30">
                    <Globe className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-300">
                      {editing ? "Edit SEO Entry" : "Create New SEO Entry"}
                    </h2>
                    <p className="text-sm text-emerald-300/70">
                      {editing ? "Update existing page SEO" : "Add new page SEO configuration"}
                    </p>
                  </div>
                </div>
                {editing && (
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-emerald-900/30 rounded-lg border border-emerald-800/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Alert */}
            <AnimatePresence>
              {alert.show && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mx-6 mt-6 p-4 rounded-xl border backdrop-blur-sm flex items-center gap-3 ${
                    alert.type === "success"
                      ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-emerald-800 text-emerald-300"
                      : "bg-gradient-to-r from-red-900/30 to-red-900/20 border-red-800 text-red-300"
                  }`}
                >
                  {alert.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium flex-1">{alert.message}</span>
                  <button
                    onClick={() => setAlert({ ...alert, show: false })}
                    className="text-emerald-300/50 hover:text-emerald-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={submit} className="space-y-4">
                {/* Page Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-emerald-400" />
                    Page Identifier
                    <span className="text-xs text-emerald-400/70 px-2 py-1 bg-emerald-900/30 rounded border border-emerald-800/30">Unique Key</span>
                  </label>
                  <input
                    required
                    value={form.page}
                    onChange={(e) => setForm({ ...form, page: e.target.value })}
                    disabled={!!editing}
                    className="w-full bg-gray-900/70 border border-emerald-800/50 rounded-xl px-4 py-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., home, electronics, product-:id"
                  />
                  <p className="text-xs text-emerald-400/70 mt-1">Unique identifier for the page</p>
                </div>

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Page Title
                    <span className="text-xs text-emerald-400/70 px-2 py-1 bg-emerald-900/30 rounded border border-emerald-800/30">
                      {form.title.length}/60
                    </span>
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-gray-900/70 border border-teal-800/50 rounded-xl px-4 py-3 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all backdrop-blur-sm"
                    placeholder="Enter page title (max 60 characters)"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    Meta Description
                    <span className="text-xs text-emerald-400/70 px-2 py-1 bg-emerald-900/30 rounded border border-emerald-800/30">
                      {form.description.length}/160
                    </span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-gray-900/70 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all backdrop-blur-sm resize-none"
                    rows={3}
                    placeholder="Enter meta description (max 160 characters)"
                  />
                </div>

                {/* Keywords Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-lime-400" />
                    Keywords
                  </label>
                  <input
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    className="w-full bg-gray-900/70 border border-lime-800/50 rounded-xl px-4 py-3 text-white placeholder-lime-500/50 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500/30 transition-all backdrop-blur-sm"
                    placeholder="e.g., electronics, gadgets, smartphones, laptops"
                  />
                  <p className="text-xs text-emerald-400/70 mt-1">Separate keywords with commas</p>
                </div>

                {/* Image URL Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4 text-emerald-400" />
                    Image URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-gray-900/70 border border-emerald-800/50 rounded-xl px-4 py-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Canonical URL Field */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4 text-teal-400" />
                    Canonical URL
                  </label>
                  <input
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full bg-gray-900/70 border border-teal-800/50 rounded-xl px-4 py-3 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all backdrop-blur-sm"
                    placeholder="https://example.com/page"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`flex-1 relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 group ${
                      loading
                        ? "bg-emerald-800/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-emerald-900/30"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          {editing ? (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Update SEO</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              <span>Create SEO Entry</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 border border-emerald-800/30 text-emerald-300 rounded-xl hover:bg-emerald-900/30 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Right Column - List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-gray-800/90 via-teal-900/20 to-gray-900/90 rounded-2xl border border-teal-800/30 backdrop-blur-xl overflow-hidden">
            {/* List Header */}
            <div className="p-6 border-b border-teal-800/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-lg border border-teal-800/30">
                    <Target className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-teal-300">SEO Entries</h2>
                    <p className="text-sm text-teal-300/70">Manage all page SEO configurations</p>
                  </div>
                </div>
                <button
                  onClick={fetchAll}
                  className="p-2 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-lg border border-teal-800/30 hover:bg-teal-800/30 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input
                  type="text"
                  placeholder="Search SEO entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/70 border border-teal-800/50 rounded-xl text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* List Content */}
            <div className="p-6">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    className="w-12 h-12 border-3 border-teal-500/30 border-t-teal-500 rounded-full mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-teal-300/70 font-medium">Loading SEO entries...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 rounded-full border border-teal-800/30 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-teal-400/50" />
                  </div>
                  <p className="text-teal-300/70">No SEO entries found</p>
                  <p className="text-sm text-teal-400/50 mt-2">Create your first SEO entry using the form</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border backdrop-blur-sm transition-all ${
                        selectedItem?._id === item._id
                          ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-emerald-800"
                          : "bg-gradient-to-r from-gray-900/30 to-teal-900/10 border-teal-800/30 hover:border-teal-700"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-teal-300 bg-teal-900/30 px-2 py-1 rounded text-sm border border-teal-800/30">
                              {item.page}
                            </span>
                            <span className="text-xs text-teal-400/70">
                              {item.title?.length || 0}/60 chars
                            </span>
                          </div>
                          {item.title && (
                            <p className="text-emerald-100 font-medium text-sm mb-1">{item.title}</p>
                          )}
                          {item.description && (
                            <p className="text-emerald-300/70 text-sm line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          {item.keywords && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                                <span key={idx} className="text-xs text-emerald-400/70 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-800/30">
                                  {keyword.trim()}
                                </span>
                              ))}
                              {item.keywords.split(',').length > 3 && (
                                <span className="text-xs text-emerald-400/50">
                                  +{item.keywords.split(',').length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(item);
                            }}
                            className="p-2 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-800/30 hover:bg-emerald-800/50 transition-colors group"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.title, "Title");
                            }}
                            className="p-2 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-lg border border-teal-800/30 hover:bg-teal-800/50 transition-colors group"
                            title="Copy Title"
                          >
                            <Copy className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(item._id);
                            }}
                            className="p-2 bg-gradient-to-br from-red-900/30 to-red-900/30 rounded-lg border border-red-800/30 hover:bg-red-800/50 transition-colors group"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                          </button>
                        </div>
                      </div>

                      {/* URL Preview */}
                      {item.url && (
                        <div className="mt-3 pt-3 border-t border-teal-800/30">
                          <div className="flex items-center gap-2">
                            <Link className="w-3 h-3 text-teal-400" />
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-teal-400 hover:text-teal-300 truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.url}
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.url, "URL");
                              }}
                              className="ml-auto text-xs text-teal-400/70 hover:text-teal-400"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-4 bg-gradient-to-r from-gray-900/50 to-teal-900/10 border-t border-teal-800/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-teal-400">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                  <span>Showing {filteredItems.length} of {items.length} entries</span>
                </div>
                <div className="text-teal-300/70">
                  {selectedItem ? "Selected: " + selectedItem.page : "Click to select"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="seoLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#0d9488" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#seoLineGradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.1 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.4,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}   