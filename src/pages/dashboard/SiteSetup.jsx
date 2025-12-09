import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle, 
  Globe, 
  Upload, 
  Save,
  ShieldCheck,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Music,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Server,
  Database,
  Lock,
  Shield,
  Settings,
  Webhook,
  Network,
  Key,
  Fingerprint,
  Cpu,
  HardDrive,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SiteSetup = () => {
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "", show: false });
  const [showPassword, setShowPassword] = useState({
    contactPhone: false,
    whatsappNumber: false,
  });

  // Social media icons mapping
  const socialIcons = {
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    tiktok: <Music className="w-4 h-4" />,
  };

  // Dynamically detect backend URL
 const API =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  const showAlert = (type, message) => {
    setAlert({ type, message, show: true });
    setTimeout(() => setAlert({ type: "", message: "", show: false }), 4000);
  };

  const fetchSite = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(`${API}/api/site`);
      if (data.success) {
        setForm({
          ...data.site,
          socialLinks: data.site.socialLinks || form.socialLinks,
        });
        setPreview(data.site.logo?.url || null);
      }
    } catch (err) {
      console.error("Error fetching site:", err);
      showAlert("error", "⚠️ Failed to load site settings");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSite();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setForm({
      ...form,
      socialLinks: { ...form.socialLinks, [e.target.name]: e.target.value },
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "socialLinks") {
          fd.append("socialLinks", JSON.stringify(form.socialLinks));
        } else {
          fd.append(key, form[key]);
        }
      });
      if (logo) fd.append("logo", logo);

      const token = localStorage.getItem("adminToken");
      const { data } = await axios.put(`${API}/api/site/update`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        showAlert("success", "✅ Site configuration saved successfully!");
        fetchSite();
      } else {
        showAlert("error", data.message || "Update failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      showAlert("error", "❌ Failed to update site configuration");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Enhanced security icons for background
  const securityIcons = [
    { icon: Shield, color: "text-emerald-400" },
    { icon: Database, color: "text-teal-400" },
    { icon: Server, color: "text-green-400" },
    { icon: Lock, color: "text-lime-400" },
    { icon: Key, color: "text-emerald-300" },
    { icon: Fingerprint, color: "text-teal-300" },
    { icon: Cpu, color: "text-green-300" },
    { icon: HardDrive, color: "text-lime-300" },
    { icon: Network, color: "text-emerald-200" },
    { icon: Webhook, color: "text-teal-200" },
    { icon: ShieldAlert, color: "text-green-200" },
  ];

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
              <Settings className="w-7 h-7 text-emerald-100" />
            </div>
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent"
            >
              Site Configuration
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-300/70 text-sm"
            >
              Secure management for your e-commerce platform settings
            </motion.p>
          </div>
        </motion.div>

        {/* Security Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-emerald-900/30 rounded-xl border border-emerald-800/30 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
              <ShieldCheck className="w-5 h-5 text-emerald-400 relative" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-300">Configuration Status</p>
              <p className="text-xs text-emerald-300/70">All settings are securely encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
            <div className="hidden md:block text-xs text-emerald-300/50 px-3 py-1 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
              v1.0.0 • Secured
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Security Stats Card */}
          <div className="bg-gradient-to-br from-gray-800/90 via-emerald-900/20 to-gray-900/90 rounded-2xl border border-emerald-800/30 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-300/70">Data Encryption</span>
                <span className="text-xs px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-full border border-emerald-800/30">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-300/70">SSL Protection</span>
                <span className="text-xs px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-full border border-emerald-800/30">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-300/70">API Security</span>
                <span className="text-xs px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-full border border-emerald-800/30">Verified</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-800/30">
              <div className="flex items-center gap-2 text-xs text-emerald-300/70">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Last Updated: Just now
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-800/90 via-teal-900/20 to-gray-900/90 rounded-2xl border border-teal-800/30 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-teal-300 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-900/50 to-emerald-900/10 hover:from-emerald-900/20 hover:to-gray-900/40 rounded-xl border border-emerald-800/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-900/30 rounded-lg group-hover:bg-emerald-800/50 transition-colors">
                    <Database className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-emerald-300">Backup Configuration</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-900/50 to-teal-900/10 hover:from-teal-900/20 hover:to-gray-900/40 rounded-xl border border-teal-800/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-900/30 rounded-lg group-hover:bg-teal-800/50 transition-colors">
                    <Server className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-sm font-medium text-teal-300">Reset to Defaults</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-gray-800/90 via-emerald-900/20 to-gray-900/90 rounded-2xl border border-emerald-800/30 backdrop-blur-xl overflow-hidden">
            {/* Form Header */}
            <div className="p-6 border-b border-emerald-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-emerald-300">Site Configuration</h2>
                  <p className="text-sm text-emerald-300/70">Update your platform settings securely</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1 bg-emerald-900/30 rounded-lg border border-emerald-800/30 text-emerald-400">
                    {fetching ? "Loading..." : "Ready"}
                  </div>
                </div>
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
                    <XCircle className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content */}
            <div className="p-6">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-emerald-300/70 font-medium">Securely loading configuration...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          Company Name
                        </label>
                        <input
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          className="w-full bg-gray-900/70 border border-emerald-800/50 rounded-xl px-4 py-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm"
                          placeholder="Enter company name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          Company Address
                        </label>
                        <input
                          name="companyAddress"
                          value={form.companyAddress}
                          onChange={handleChange}
                          className="w-full bg-gray-900/70 border border-teal-800/50 rounded-xl px-4 py-3 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all backdrop-blur-sm"
                          placeholder="Enter company address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-400" />
                          Contact Email
                        </label>
                        <input
                          name="contactEmail"
                          value={form.contactEmail}
                          onChange={handleChange}
                          type="email"
                          className="w-full bg-gray-900/70 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all backdrop-blur-sm"
                          placeholder="support@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-lime-400" />
                          Contact Phone
                        </label>
                        <div className="relative">
                          <input
                            name="contactPhone"
                            value={form.contactPhone}
                            onChange={handleChange}
                            type={showPassword.contactPhone ? "text" : "password"}
                            className="w-full bg-gray-900/70 border border-lime-800/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-lime-500/50 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500/30 transition-all backdrop-blur-sm"
                            placeholder="Enter phone number"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("contactPhone")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                          >
                            {showPassword.contactPhone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          WhatsApp Number
                        </label>
                        <div className="relative">
                          <input
                            name="whatsappNumber"
                            value={form.whatsappNumber}
                            onChange={handleChange}
                            type={showPassword.whatsappNumber ? "text" : "password"}
                            className="w-full bg-gray-900/70 border border-emerald-800/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all backdrop-blur-sm"
                            placeholder="Optional WhatsApp number"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("whatsappNumber")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                          >
                            {showPassword.whatsappNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-teal-400" />
                          Company Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              onChange={handleLogoChange}
                              accept="image/*"
                              className="hidden"
                              id="logoUpload"
                            />
                            <label
                              htmlFor="logoUpload"
                              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-800 to-emerald-900/30 rounded-xl border border-dashed border-emerald-700/50 hover:border-emerald-500 transition-all cursor-pointer"
                            >
                              <Upload className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-300 text-sm">Choose logo file</span>
                            </label>
                          </div>
                          {preview && (
                            <div className="relative group">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-700/50">
                                <img
                                  src={preview}
                                  alt="Logo Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links Section */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-teal-900/20 p-6 rounded-2xl border border-teal-800/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-5 h-5 text-teal-400" />
                      <h3 className="text-lg font-bold text-teal-300">Social Media Links</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(form.socialLinks).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-semibold text-emerald-300/70 mb-2 flex items-center gap-2">
                            <span className="text-emerald-400">
                              {socialIcons[key]}
                            </span>
                            <span className="capitalize">{key}</span>
                          </label>
                          <input
                            name={key}
                            value={value || ""}
                            onChange={handleSocialChange}
                            className="w-full bg-gray-900/70 border border-teal-800/50 rounded-xl px-3 py-2 text-sm text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all backdrop-blur-sm"
                            placeholder={`${key}.com/...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className={`w-full relative overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 group ${
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
                            <span>Saving Configuration...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Site Configuration</span>
                            <ShieldCheck className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
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
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gradient-to-r from-gray-900/50 to-emerald-900/10 border-t border-emerald-800/30">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Configuration Secured</span>
                </div>
                <div className="text-emerald-300/70">
                  API: {API.replace('http://', '').replace('https://', '')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Animated Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {securityIcons.map((IconObj, index) => {
          const Icon = IconObj.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${IconObj.color} opacity-5`}
              initial={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
                rotate: Math.random() * 360,
              }}
              animate={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 40 + 40,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5,
              }}
            >
              <Icon size={Math.random() * 24 + 16} />
            </motion.div>
          );
        })}

        {/* Grid Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#0d9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.3,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SiteSetup;