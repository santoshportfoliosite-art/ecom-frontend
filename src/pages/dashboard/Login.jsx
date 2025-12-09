import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Lock, 
  ArrowLeft, 
  LogIn, 
  Cpu, 
  Database, 
  Fingerprint,
  Key,
  Server,
  ShieldCheck,
  Network,
  HardDrive,
  ShieldAlert
} from "lucide-react";

export default function AdminLogin() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const securityIcons = [
    { icon: Shield, color: "text-emerald-400", size: 24 },
    { icon: Cpu, color: "text-teal-400", size: 22 },
    { icon: Database, color: "text-green-400", size: 26 },
    { icon: Fingerprint, color: "text-lime-400", size: 24 },
    { icon: Key, color: "text-emerald-300", size: 20 },
    { icon: Server, color: "text-teal-300", size: 28 },
    { icon: ShieldCheck, color: "text-green-300", size: 26 },
    { icon: Network, color: "text-lime-300", size: 24 },
    { icon: HardDrive, color: "text-emerald-200", size: 22 },
    { icon: ShieldAlert, color: "text-teal-200", size: 24 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    } catch (err) {
      console.error("❌ Login error:", err.message);
      setMessage("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-6 flex justify-center items-center overflow-hidden">
      {/* Animated Security Icons Background */}
      <div className="absolute inset-0 overflow-hidden">
        {securityIcons.map((IconObj, index) => {
          const Icon = IconObj.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${IconObj.color} opacity-20`}
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
                duration: Math.random() * 30 + 30,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5,
              }}
            >
              <Icon size={IconObj.size} />
            </motion.div>
          );
        })}

        {/* Binary Code Rain Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-500/10 font-mono text-sm"
              initial={{ y: "-100%", x: Math.random() * 100 + "vw" }}
              animate={{ y: "100vh" }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </motion.div>
          ))}
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
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
      </div>

      {/* Glassmorphism Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative bg-gradient-to-br from-gray-800/90 via-emerald-900/20 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md p-8 border border-emerald-800/30 z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-6 shadow-lg"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2"
          >
            Secure Admin Portal
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-200/70 text-sm font-medium tracking-wide"
          >
            Restricted Access • Enhanced Security Protocol
          </motion.p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Administrator Email
            </label>
            <div className={`relative transition-all duration-300 ${isFocused.email ? 'ring-2 ring-emerald-500/50 rounded-xl' : ''}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
                className="w-full bg-gray-900/70 border border-emerald-800/50 rounded-xl p-4 pl-12 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all backdrop-blur-sm"
                placeholder="admin@secure.com"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Key className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-emerald-200 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Secure Password
            </label>
            <div className={`relative transition-all duration-300 ${isFocused.password ? 'ring-2 ring-teal-500/50 rounded-xl' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                className="w-full bg-gray-900/70 border border-teal-800/50 rounded-xl p-4 pr-12 pl-12 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all backdrop-blur-sm"
                placeholder="••••••••••"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-teal-500" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  message.includes("✅")
                    ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                    : "bg-red-900/30 border-red-800 text-red-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${message.includes("✅") ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full relative overflow-hidden rounded-xl p-4 font-semibold shadow-lg transition-all duration-300 group ${
              loading
                ? "bg-emerald-800/50 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="tracking-wide">Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="tracking-wide">Authenticate & Access</span>
                </>
              )}
            </span>
            {!loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.button>
        </form>

        {/* Security Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 p-3 bg-gray-900/50 rounded-lg border border-emerald-800/30"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Connection Secure</span>
            </div>
            <div className="text-emerald-300/70">AES-256 Encrypted</div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 pt-6 border-t border-emerald-800/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 text-emerald-300/70 hover:text-emerald-200 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Public Portal
          </button>
          
          <button
            onClick={() => setMessage("For security reasons, please contact your system administrator directly for password recovery.")}
            className="text-sm text-emerald-400/50 hover:text-emerald-300 transition-colors font-medium hover:underline"
          >
            Lost Access?
          </button>
        </motion.div>
      </motion.div>

      {/* Connection Lines Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0d9488" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
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
            animate={{ pathLength: 1, opacity: 0.3 }}
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
  );
}