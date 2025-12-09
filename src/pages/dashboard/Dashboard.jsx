import { useEffect, useState } from "react";
import Drawer from "../../components/dashboard/drawer";
import { motion } from "framer-motion";
import { Shield, User, Mail, LogOut, Phone } from "lucide-react";

export default function Dashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.warn("⚠️ No admin token found, redirecting to login...");
      window.location.href = "/dashboard/login";
      return;
    }

    const fetchAdmin = async () => {
      try {
        console.log("🔍 Fetching admin profile...");
        const res = await fetch(`${backendUrl}/api/admin/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Admin auth failed:", errorText);
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        console.log("✅ Admin data loaded:", data);
        setAdmin(data.admin);
      } catch (err) {
        console.error("❌ Error fetching admin data:", err.message);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/dashboard/login";
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [backendUrl]);

  const handleLogout = () => {
    console.log("🚪 Logging out admin...");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/dashboard/login";
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-200 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900">
      <Drawer onLogout={handleLogout} />
      
      <header className="bg-gradient-to-r from-emerald-800/80 to-teal-800/80 backdrop-blur-lg text-white px-4 sm:px-6 py-4 shadow-xl flex flex-wrap justify-between items-center sm:pl-72 border-b border-emerald-700/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-900/30 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-emerald-200/70 text-xs">Secure Control Panel</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </header>

      <main className="p-4 sm:p-8 sm:pl-72 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {admin ? (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <User className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">
                      Welcome, {admin.fullname} 👋
                    </h2>
                    <p className="text-emerald-200/80 mb-4">Administrator Account</p>
                    
                    <div className="space-y-3 bg-gray-900/40 rounded-xl p-5">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300 break-all">{admin.email}</span>
                      </div>
                      {admin.contact && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-teal-400" />
                          <span className="text-gray-300">{admin.contact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/40 border-t border-emerald-800/30 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-300">Full</div>
                    <div className="text-sm text-emerald-200/70">Access Level</div>
                  </div>
                  <div className="bg-teal-900/20 border border-teal-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-teal-300">Admin</div>
                    <div className="text-sm text-teal-200/70">Role Type</div>
                  </div>
                  <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-300">Active</div>
                    <div className="text-sm text-emerald-200/70">Status</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-800/30 p-8 text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Admin Data Not Found</h3>
              <p className="text-gray-400">Please check console for errors and try logging in again.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}