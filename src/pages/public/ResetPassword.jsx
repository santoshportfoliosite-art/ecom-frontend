import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Key, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backendUrl}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => (window.location.href = "/"), 2000);
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-4"
          >
            <Key className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-emerald-200/70 mt-2">Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-teal-800/30 rounded-xl p-3 pl-11 text-white placeholder-teal-500/50 focus:outline-none focus:border-teal-500 transition-all"
                required
              />
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                isSuccess
                  ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                  : "bg-red-900/30 border-red-800 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium">{message}</span>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full relative overflow-hidden rounded-xl p-4 font-semibold shadow-lg transition-all ${
              loading
                ? "bg-emerald-800/50 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </span>
          </motion.button>
        </form>

        {isSuccess && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Redirecting to login page...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}