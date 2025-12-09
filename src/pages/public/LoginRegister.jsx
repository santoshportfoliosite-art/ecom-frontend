import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Shield,
  ArrowRight,
  Key,
} from "lucide-react";
import useSEO from "../../hooks/useSEO";
export default function LoginRegister() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    fullname: false,
    contact: false,
    email: false,
    password: false,
  });
  const seo = useSEO("login");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? `${backendUrl}/api/auth/login`
        : `${backendUrl}/api/auth/register`;

      const payload = isLogin
        ? {
            identifier: formData.email || formData.contact,
            password: formData.password,
          }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => (window.location.href = "/home"), 1200);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setMessage("⚠️ Server not reachable. Check backend.");
      setLoading(false);
    }
  };

  return (
    <>
      {seo}
      <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-6 flex justify-center items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
              initial={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
              }}
              animate={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

          {/* Subtle Grid */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md p-8 md:p-10 border border-emerald-800/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </motion.h2>
            <motion.p
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-200/70 text-sm mt-2"
            >
              {isLogin
                ? "Sign in to continue to your account"
                : "Join our secure community"}
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Full Name
                    </label>
                    <div
                      className={`relative transition-all ${
                        isFocused.fullname
                          ? "ring-2 ring-emerald-500/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <input
                        type="text"
                        name="fullname"
                        placeholder="Enter your full name"
                        value={formData.fullname}
                        onChange={handleChange}
                        onFocus={() => handleFocus("fullname")}
                        onBlur={() => handleBlur("fullname")}
                        className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                        required
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Contact Number
                    </label>
                    <div
                      className={`relative transition-all ${
                        isFocused.contact
                          ? "ring-2 ring-teal-500/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <input
                        type="text"
                        name="contact"
                        placeholder="Enter contact number"
                        value={formData.contact}
                        onChange={handleChange}
                        onFocus={() => handleFocus("contact")}
                        onBlur={() => handleBlur("contact")}
                        className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pl-11 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Email Address
                    </label>
                    <div
                      className={`relative transition-all ${
                        isFocused.email
                          ? "ring-2 ring-emerald-500/30 rounded-lg"
                          : ""
                      }`}
                    >
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={() => handleBlur("email")}
                        className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {isLogin && (
                <motion.div
                  key="login-email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Email or Contact
                  </label>
                  <div
                    className={`relative transition-all ${
                      isFocused.email
                        ? "ring-2 ring-emerald-500/30 rounded-lg"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter email or contact"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={() => handleBlur("email")}
                      className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">
                Password
              </label>
              <div
                className={`relative transition-all ${
                  isFocused.password ? "ring-2 ring-teal-500/30 rounded-lg" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pr-11 pl-11 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 ml-auto w-fit"
                >
                  <Key className="w-3 h-3" />
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full relative overflow-hidden rounded-xl p-3.5 font-semibold shadow-lg transition-all duration-300 ${
                loading
                  ? "bg-emerald-800/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
              {!loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          </form>

          {/* Toggle Between Login/Register */}
          <div className="mt-8 pt-6 border-t border-emerald-800/30">
            <p className="text-center text-emerald-200/70 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors inline-flex items-center gap-1"
              >
                {isLogin ? "Register now" : "Sign in"}
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>

          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-6 p-3 rounded-xl border backdrop-blur-sm ${
                  message.includes("✅")
                    ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                    : message.includes("⚠️")
                    ? "bg-yellow-900/30 border-yellow-800 text-yellow-300"
                    : "bg-red-900/30 border-red-800 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      message.includes("✅")
                        ? "bg-emerald-500 animate-pulse"
                        : message.includes("⚠️")
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400/60">
              <Shield className="w-3 h-3" />
              <span>Your data is protected with end-to-end encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
