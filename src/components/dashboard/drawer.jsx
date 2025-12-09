import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function Drawer({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "Manage Admins",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard/manageadmin",
    },
    {
      name: "Manage Products",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/products",
    },
    {
      name: "Manage Orders",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/orders",
    },
    {
      name: "Manage Slider",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/manageslider",
    },
     {
      name: "Manage Company",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/sitesetup",
    },
    {
      name: "SEO",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/seo",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-50 p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg md:hidden"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-emerald-900/20 backdrop-blur-xl shadow-2xl z-40 w-72 border-r border-emerald-800/30"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-emerald-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                      <p className="text-xs text-emerald-300/70">Secure Control Center</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          whileHover={{ x: 5 }}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-600/80 to-teal-600/80 text-white shadow-lg"
                              : "text-gray-300 hover:bg-emerald-900/30 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${isActive ? "text-white" : "text-emerald-400"}`}>
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </motion.div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-emerald-800/30">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLogout();
                      navigate("/dashboard/login");
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-300 hover:text-red-200 border border-red-800/30 rounded-xl font-semibold transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Overlay for mobile */}
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
              />
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}