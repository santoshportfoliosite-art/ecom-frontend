// OrderManagement.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  CheckSquare,
  DollarSign,
  RefreshCw,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingBag,
  List,
  ShoppingCart,
  Box,
  Tag,
  Hash,
  Layers
} from "lucide-react";
import OrderTable from "./OrderTable";

export default function OrderManagement() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [editForm, setEditForm] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    status: "",
    paymentStatus: "",
    deliveryOption: "",
    notes: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" }
  ];

  const deliveryOptions = [
    { value: "standard", label: "Standard Delivery" },
    { value: "express", label: "Express Delivery" },
    { value: "pickup", label: "Store Pickup" }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter]);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("adminToken"); // ✅ admin token

    if (!token) {
      throw new Error("No admin token found. Please log in as admin.");
    }

    const response = await fetch(`${backendUrl}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      setOrders(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0
    };

    orders.forEach(order => {
      stats[order.status] = (stats[order.status] || 0) + 1;
      if (order.status === "delivered" && order.paymentStatus === "paid") {
        stats.revenue += order.total;
      }
    });

    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(term) ||
        order.shippingAddress?.fullName?.toLowerCase().includes(term) ||
        order.shippingAddress?.phone?.includes(term) ||
        order.shippingAddress?.email?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === new Date().toDateString();
          case "week":
            return orderDate >= sevenDaysAgo;
          case "month":
            return orderDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditForm({
      subtotal: order.subtotal,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryOption: order.deliveryOption || "standard",
      notes: order.notes || ""
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${backendUrl}/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error("Failed to update order");

      const updatedOrder = await response.json();
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
      
      setShowEditModal(false);
      alert("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete order");

      // Update local state
      setOrders(orders.filter(order => order._id !== orderId));
      setShowDeleteModal(false);
      setOrderToDelete(null);
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const toggleRowExpand = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order._id)));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30';
      case 'confirmed': return 'text-blue-400 bg-blue-900/20 border-blue-800/30';
      case 'processing': return 'text-purple-400 bg-purple-900/20 border-purple-800/30';
      case 'shipped': return 'text-indigo-400 bg-indigo-900/20 border-indigo-800/30';
      case 'delivered': return 'text-emerald-400 bg-emerald-900/20 border-emerald-800/30';
      case 'cancelled': return 'text-red-400 bg-red-900/20 border-red-800/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800/30';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-emerald-400 bg-emerald-900/20 border-emerald-800/30';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30';
      case 'failed': return 'text-red-400 bg-red-900/20 border-red-800/30';
      case 'refunded': return 'text-orange-400 bg-orange-900/20 border-orange-800/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-300 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2"
        >
          Order Management
        </motion.h1>
        <p className="text-emerald-300/70">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "from-emerald-900/30 to-teal-900/30", textColor: "text-emerald-300" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-900/30 to-amber-900/30", textColor: "text-yellow-300" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "from-emerald-900/30 to-green-900/30", textColor: "text-emerald-300" },
          { label: "Total Revenue", value: `₹${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "from-teal-900/30 to-cyan-900/30", textColor: "text-teal-300" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl border border-emerald-800/30 p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300/70">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color.replace('900/30', '900/50')}`}>
                <stat.icon className="w-6 h-6 text-emerald-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-gradient-to-br from-gray-800/90 via-emerald-900/20 to-gray-900/90 rounded-xl border border-emerald-800/30 mb-6 p-4 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200 placeholder-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
            >
              <option value="all" className="bg-gray-900">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value} className="bg-gray-900">
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
            >
              <option value="all" className="bg-gray-900">All Payments</option>
              {paymentStatusOptions.map(status => (
                <option key={status.value} value={status.value} className="bg-gray-900">
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
            >
              <option value="all" className="bg-gray-900">All Time</option>
              <option value="today" className="bg-gray-900">Today</option>
              <option value="week" className="bg-gray-900">Last 7 Days</option>
              <option value="month" className="bg-gray-900">Last 30 Days</option>
            </select>

            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-emerald-900/50 text-emerald-300 rounded-lg hover:bg-emerald-800/50 border border-emerald-800/30 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button className="px-4 py-2 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 text-white rounded-lg hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table - Update to pass handleView function */}
      <OrderTable
        orders={filteredOrders}
        expandedRows={expandedRows}
        selectedOrders={selectedOrders}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
        onToggleRowExpand={toggleRowExpand}
        onToggleSelectOrder={toggleSelectOrder}
        onSelectAllOrders={selectAllOrders}
        onView={handleView}  // Add this
        onEdit={handleEdit}
        onDelete={(order) => {
          setOrderToDelete(order);
          setShowDeleteModal(true);
        }}
        formatDate={formatDate}
      />

      {/* View Order Modal */}
      <AnimatePresence>
        {showViewModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900 via-emerald-900/30 to-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-800/30"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      Order Details
                    </h2>
                    <p className="text-emerald-400/70 text-sm mt-1">
                      Order ID: {selectedOrder._id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Summary Section */}
                  <div className="space-y-6">
                    {/* Order Status Cards */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-emerald-800/30">
                      <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <p className="text-sm text-emerald-300/70">Order Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-emerald-300/70">Payment Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-emerald-300/70">Order Date</p>
                          <p className="text-emerald-300 font-medium">{formatDate(selectedOrder.createdAt)}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-emerald-300/70">Delivery</p>
                          <p className="text-emerald-300 font-medium">
                            {deliveryOptions.find(opt => opt.value === selectedOrder.deliveryOption)?.label || "Standard"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-emerald-800/30">
                      <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm text-emerald-300/70">Name</p>
                            <p className="text-emerald-300 font-medium">{selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm text-emerald-300/70">Phone</p>
                            <p className="text-emerald-300 font-medium">{selectedOrder.shippingAddress?.phone || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm text-emerald-300/70">Email</p>
                            <p className="text-emerald-300 font-medium">{selectedOrder.shippingAddress?.email || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                          <div>
                            <p className="text-sm text-emerald-300/70">Shipping Address</p>
                            <p className="text-emerald-300 font-medium">
                              {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, 
                              {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items Section */}
                  <div className="space-y-6">
                    {/* Ordered Items */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-emerald-800/30">
                      <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Ordered Items ({selectedOrder.items?.length || 0})
                      </h3>
                      
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-900/30 to-emerald-900/10 border border-emerald-800/20"
                            >
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover border border-emerald-800/30"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-800/30 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-emerald-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-emerald-300">{item.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      {item.productId && (
                                        <span className="text-xs text-emerald-400/70 flex items-center gap-1">
                                          <Hash className="w-3 h-3" />
                                          {item.productId}
                                        </span>
                                      )}
                                      {item.category && (
                                        <span className="text-xs text-emerald-400/70 flex items-center gap-1">
                                          <Layers className="w-3 h-3" />
                                          {item.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-emerald-300 font-bold">₹{item.price?.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-emerald-400/70 flex items-center gap-1">
                                      <Tag className="w-3 h-3" />
                                      Qty: {item.quantity}
                                    </span>
                                    {item.size && (
                                      <span className="text-sm text-emerald-400/70">
                                        Size: {item.size}
                                      </span>
                                    )}
                                    {item.color && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-sm text-emerald-400/70">Color:</span>
                                        <div 
                                          className="w-3 h-3 rounded-full border border-emerald-800/30"
                                          style={{ backgroundColor: item.color }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-emerald-300 font-semibold">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
                          <p className="text-emerald-300/50">No items found in this order</p>
                        </div>
                      )}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-emerald-800/30">
                      <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-emerald-300/70">
                          <span>Subtotal</span>
                          <span>₹{selectedOrder.subtotal?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-emerald-300/70">
                          <span>Tax</span>
                          <span>₹{selectedOrder.tax?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-emerald-300/70">
                          <span>Shipping</span>
                          <span>₹{selectedOrder.shipping?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="border-t border-emerald-800/30 pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold text-emerald-300">
                            <span>Total</span>
                            <span>₹{selectedOrder.total?.toFixed(2) || "0.00"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div className="mt-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-emerald-800/30">
                    <h3 className="text-lg font-semibold text-emerald-300 mb-2">Order Notes</h3>
                    <p className="text-emerald-300/70">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2 border border-emerald-800/30 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedOrder);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 text-white rounded-lg hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 transition-all"
                  >
                    Edit Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900 via-emerald-900/30 to-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-800/30"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Edit Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Amount Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Subtotal (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.subtotal}
                        onChange={(e) => {
                          const subtotal = parseFloat(e.target.value) || 0;
                          const newTotal = subtotal + editForm.tax + editForm.shipping;
                          setEditForm(prev => ({
                            ...prev,
                            subtotal,
                            total: newTotal
                          }));
                        }}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Tax (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.tax}
                        onChange={(e) => {
                          const tax = parseFloat(e.target.value) || 0;
                          const newTotal = editForm.subtotal + tax + editForm.shipping;
                          setEditForm(prev => ({
                            ...prev,
                            tax,
                            total: newTotal
                          }));
                        }}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Shipping Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.shipping}
                        onChange={(e) => {
                          const shipping = parseFloat(e.target.value) || 0;
                          const newTotal = editForm.subtotal + editForm.tax + shipping;
                          setEditForm(prev => ({
                            ...prev,
                            shipping,
                            total: newTotal
                          }));
                        }}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Total Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.total}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-900/30 border border-emerald-800/30 rounded-lg text-emerald-300"
                      />
                    </div>
                  </div>

                  {/* Status and Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Order Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={editForm.paymentStatus}
                        onChange={(e) => setEditForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      >
                        {paymentStatusOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Delivery Option
                      </label>
                      <select
                        value={editForm.deliveryOption}
                        onChange={(e) => setEditForm(prev => ({ ...prev, deliveryOption: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200"
                      >
                        {deliveryOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                      Order Notes
                    </label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-2 bg-gray-900/50 border border-emerald-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-200 resize-none"
                      placeholder="Add any notes or updates about this order..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-emerald-800/30 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 text-white rounded-lg hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 transition-all"
                  >
                    Update Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && orderToDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900 via-emerald-900/30 to-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-800/30"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-900/30 to-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-800/30">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-emerald-300 mb-2">Delete Order</h2>
                <p className="text-emerald-300/70 mb-6">
                  Are you sure you want to delete order #{orderToDelete._id.slice(-8).toUpperCase()}? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setOrderToDelete(null);
                    }}
                    className="px-6 py-2 border border-emerald-800/30 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(orderToDelete._id)}
                    className="px-6 py-2 bg-gradient-to-r from-red-700 via-red-700 to-red-700 text-white rounded-lg hover:from-red-600 hover:via-red-600 hover:to-red-600 transition-all"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}