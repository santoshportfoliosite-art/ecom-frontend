import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Edit, Trash2, Search, Shield } from "lucide-react";

export default function AdminUserManagement() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredAdmins = admins.filter(admin =>
    admin.fullname.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const fetchAdmins = async () => {
    console.log("🔍 Fetching admin list...");
    try {
      const res = await fetch(`${backendUrl}/api/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ Admins fetched successfully:", data.admins);
        setAdmins(data.admins);
      } else {
        console.error("❌ Failed to load admins:", data.message);
        setMessage(data.message);
      }
    } catch (err) {
      console.error("❌ fetchAdmins error:", err.message);
      setMessage("Error fetching admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✏️ Submitting admin form...", formData);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${backendUrl}/api/admin/${editingId}`
      : `${backendUrl}/api/admin/add`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Admin saved successfully:", data);
        setMessage(data.message);
        setFormData({ fullname: "", contact: "", email: "", password: "" });
        setEditingId(null);
        fetchAdmins();
      } else {
        console.error("❌ Failed to save admin:", data.message);
        setMessage(data.message);
      }
    } catch (err) {
      console.error("❌ handleSubmit error:", err.message);
      setMessage("Server error");
    }
  };

  const handleDelete = async (id) => {
    console.log("🗑️ Deleting admin:", id);
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ Admin deleted successfully");
        setMessage(data.message);
        fetchAdmins();
      } else {
        console.error("❌ Delete failed:", data.message);
        setMessage(data.message);
      }
    } catch (err) {
      console.error("❌ handleDelete error:", err.message);
      setMessage("Error deleting admin");
    }
  };

  const handleEdit = (admin) => {
    console.log("✏️ Editing admin:", admin);
    setFormData({
      fullname: admin.fullname,
      contact: admin.contact,
      email: admin.email,
      password: "",
    });
    setEditingId(admin._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-800/30 p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-3">
                <Users className="w-8 h-8" />
                Admin Management
              </h2>
              <p className="text-emerald-200/70 mt-2">Manage administrator accounts</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                placeholder="Search admins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 bg-gray-900/50 border border-emerald-800/30 rounded-xl p-3 pl-10 text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                message.includes("success") 
                  ? "bg-emerald-900/30 border-emerald-800 text-emerald-300"
                  : "bg-red-900/30 border-red-800 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${message.includes("success") ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="font-medium">{message}</span>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div className="bg-gray-900/40 border border-emerald-800/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center gap-2">
              {editingId ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {editingId ? "Edit Admin" : "Add New Admin"}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["fullname", "contact", "email", "password"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-emerald-200 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-emerald-800/30 rounded-xl p-3 text-white placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all"
                    required={field !== "password" || !editingId}
                  />
                </div>
              ))}
              
              <div className="md:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {editingId ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {editingId ? "Update Admin" : "Add Admin"}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-emerald-800/30">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50">
                <tr>
                  <th className="p-4 text-left text-emerald-300 font-semibold">Name</th>
                  <th className="p-4 text-left text-emerald-300 font-semibold">Email</th>
                  <th className="p-4 text-left text-emerald-300 font-semibold">Contact</th>
                  <th className="p-4 text-center text-emerald-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length ? (
                  filteredAdmins.map((admin, index) => (
                    <motion.tr
                      key={admin._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-emerald-800/20 hover:bg-emerald-900/10 transition-colors"
                    >
                      <td className="p-4 text-gray-300 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-400" />
                          </div>
                          {admin.fullname}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{admin.email}</td>
                      <td className="p-4 text-gray-300">{admin.contact}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(admin)}
                            className="bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 px-4 py-2 rounded-lg border border-emerald-800/30 flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(admin._id)}
                            className="bg-red-900/30 hover:bg-red-800/40 text-red-300 px-4 py-2 rounded-lg border border-red-800/30 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-8">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-emerald-500/30" />
                        <p className="text-emerald-200/70 font-medium">No admins found</p>
                        {search && (
                          <p className="text-sm text-emerald-400/50">Try a different search term</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}