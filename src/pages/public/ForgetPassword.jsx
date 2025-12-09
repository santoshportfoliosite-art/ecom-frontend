import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, ArrowLeft } from "lucide-react";

export default function ForgetPassword() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
      
      if (res.ok) {
        setIsSent(true);
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
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Forgot Password
          </h2>
          <p className="text-emerald-200/70 mt-2">
            {isSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-emerald-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 pl-11 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  message.includes("sent") 
                    ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                    : "bg-red-900/30 border-red-800 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${message.includes("sent") ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => window.location.href = "/"}
                className="w-full text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </motion.button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-900/30 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-10 h-10 text-emerald-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-emerald-300 mb-2">Check Your Email</h3>
              <p className="text-gray-300">
                We've sent password reset instructions to:
              </p>
              <p className="text-emerald-400 font-medium mt-2">{email}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-emerald-200/70">
                Didn't receive the email? Check your spam folder or
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSent(false)}
                className="w-full bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-800/30 rounded-xl p-3 font-medium transition-colors"
              >
                Try Another Email
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = "/"}
                className="w-full text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Login
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-emerald-800/30">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Secure password reset process</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}