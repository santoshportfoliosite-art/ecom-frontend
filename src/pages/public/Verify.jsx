import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

export default function Verify() {
  const { token } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [status, setStatus] = useState("Verifying...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/auth/verify/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email verified successfully!") {
          setIsSuccess(true);
          setStatus("Email verified successfully! You can now log in.");
          setTimeout(() => (window.location.href = "/"), 2000);
        } else {
          setIsSuccess(false);
          setStatus("Invalid or expired token");
        }
      })
      .catch(() => {
        setIsSuccess(false);
        setStatus("Server not reachable.");
      });
  }, [token, backendUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 p-8 max-w-md w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              isSuccess 
                ? "bg-emerald-900/30 border-2 border-emerald-500" 
                : "bg-red-900/30 border-2 border-red-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </motion.div>

          <h2 className={`text-2xl font-bold mb-4 ${
            isSuccess ? "text-emerald-300" : "text-red-300"
          }`}>
            {isSuccess ? "Verification Successful!" : "Verification Failed"}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {status}
          </p>

          <div className="space-y-4">
            {isSuccess && (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Redirecting to login page...</span>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/"}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Go to Login
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}