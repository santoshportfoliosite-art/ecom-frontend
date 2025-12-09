import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  AlertCircle,
  FileText,

  Loader2,
} from "lucide-react";
import useSEO from "../../hooks/useSEO";
export default function MyOrders() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [error, setError] = useState("");

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-700",
      icon: RefreshCw,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-blue-100 text-blue-700",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  ];
  const seo = useSEO("myorders");
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          return;
        }
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch orders: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error.message || "Failed to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(term) ||
          order.shippingAddress?.fullName?.toLowerCase().includes(term) ||
          order.paymentMethod?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter((order) => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate;
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredOrders(filtered);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? (
      <statusOption.icon className="w-4 h-4" />
    ) : (
      <Package className="w-4 h-4" />
    );
  };

  const calculateOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    };
  };

  const stats = calculateOrderStats();

  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order._id?.slice(-8).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .invoice-table th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1>INVOICE</h1>
            <p>Order #${order._id?.slice(-8).toUpperCase()}</p>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="invoice-details">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${
              order.shippingAddress?.fullName || "N/A"
            }</p>
            <p><strong>Phone:</strong> ${
              order.shippingAddress?.phone || "N/A"
            }</p>
            <p><strong>Email:</strong> ${
              order.shippingAddress?.email || "N/A"
            }</p>
            <p><strong>Address:</strong> ${
              order.shippingAddress?.address || "N/A"
            }, ${order.shippingAddress?.city || ""}</p>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                ?.map(
                  (item) => `
                <tr>
                  <td>${item.name || "Item"}</td>
                  <td>${item.quantity || 1}</td>
                  <td>${formatCurrency(item.price || 0)}</td>
                  <td>${formatCurrency(
                    (item.price || 0) * (item.quantity || 1)
                  )}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td colspan="3">Subtotal</td>
                <td>${formatCurrency(order.subtotal || 0)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Tax</td>
                <td>${formatCurrency(order.tax || 0)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Shipping</td>
                <td>${formatCurrency(order.shipping || 0)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3"><strong>Grand Total</strong></td>
                <td><strong>${formatCurrency(order.total || 0)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-footer">
            <p><strong>Payment Status:</strong> ${
              order.paymentStatus || "N/A"
            }</p>
            <p><strong>Order Status:</strong> ${order.status || "N/A"}</p>
            <p><strong>Payment Method:</strong> ${
              order.paymentMethod || "N/A"
            }</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-green-600 font-semibold">
              Loading your orders...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error && !loading) {
    return (
      <>
        {seo}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-accent-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {seo}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                Track and manage all your orders in one place
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 rounded-lg hover:from-green-500/20 hover:to-blue-500/20 border border-green-200 flex items-center gap-2 transition-colors self-start"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Orders",
              value: stats.total,
              icon: ShoppingBag,
              color: "bg-gradient-to-br from-green-50 to-blue-50",
              textColor: "text-gray-900",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              color: "bg-gradient-to-br from-yellow-50 to-yellow-50",
              textColor: "text-yellow-700",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: CheckCircle,
              color: "bg-gradient-to-br from-green-50 to-green-50",
              textColor: "text-green-700",
            },
            {
              label: "Total Spent",
              value: formatCurrency(stats.totalSpent),
              icon: DollarSign,
              color: "bg-gradient-to-br from-blue-50 to-blue-50",
              textColor: "text-blue-700",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} rounded-xl border border-gray-200 p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${stat.color} border border-gray-200`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${
                      stat.label === "Total Orders"
                        ? "text-green-500"
                        : stat.label === "Pending"
                        ? "text-yellow-500"
                        : stat.label === "Delivered"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by ID, name, or payment method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900"
              >
                <option value="all" className="text-gray-900">
                  All Status
                </option>
                {statusOptions.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    className="text-gray-900"
                  >
                    {status.label}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900"
              >
                <option value="all" className="text-gray-900">
                  All Time
                </option>
                <option value="today" className="text-gray-900">
                  Today
                </option>
                <option value="week" className="text-gray-900">
                  Last 7 Days
                </option>
                <option value="month" className="text-gray-900">
                  Last 30 Days
                </option>
                <option value="year" className="text-gray-900">
                  This Year
                </option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-gray-700 rounded-lg hover:from-green-500/20 hover:to-blue-500/20 border border-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gradient-to-r from-green-50/50 to-blue-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                            #{order._id?.slice(-8).toUpperCase() || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items?.length || 0} items
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                                statusOptions.find(
                                  (s) => s.value === order.status
                                )?.color || "bg-gray-100 text-gray-700"
                              } border border-gray-200`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1.5">
                                {statusOptions.find(
                                  (s) => s.value === order.status
                                )?.label || order.status}
                              </span>
                            </span>
                            {order.deliveryOption && (
                              <span className="text-xs text-gray-500">
                                {order.deliveryOption}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : order.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.paymentStatus === "paid" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {order.paymentStatus?.charAt(0).toUpperCase() +
                                order.paymentStatus?.slice(1) || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {order.paymentMethod?.toUpperCase() || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRowExpand(order._id)}
                              className="text-green-600 hover:text-green-700 transition-colors p-1.5 rounded bg-green-50 border border-green-200"
                              title={
                                expandedRows.has(order._id)
                                  ? "Hide Details"
                                  : "View Details"
                              }
                            >
                              {expandedRows.has(order._id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(order)}
                              className="text-blue-600 hover:text-blue-700 transition-colors p-1.5 rounded bg-blue-50 border border-blue-200"
                              title="Print Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row Details */}
                      {expandedRows.has(order._id) && (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 bg-gradient-to-r from-green-50/30 to-blue-50/30"
                          >
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                              {/* Shipping Info */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4 text-green-500" />
                                  Shipping Information
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-green-500" />
                                    <span>
                                      {order.shippingAddress?.fullName || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-green-500" />
                                    <span>
                                      {order.shippingAddress?.phone || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-green-500" />
                                    <span>
                                      {order.shippingAddress?.email || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-green-500 mt-1" />
                                    <span>
                                      {order.shippingAddress?.address || "N/A"},
                                      {order.shippingAddress?.city
                                        ? ` ${order.shippingAddress.city}`
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Details */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                                  Order Details
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">
                                      {formatCurrency(order.subtotal || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span className="font-medium">
                                      {formatCurrency(order.tax || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span className="font-medium">
                                      {formatCurrency(order.shipping || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="font-semibold">
                                      Total:
                                    </span>
                                    <span className="font-bold text-lg text-gray-900">
                                      {formatCurrency(order.total || 0)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Items List */}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <Package className="w-4 h-4 text-green-500" />
                                  Order Items ({order.items?.length || 0})
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                  {order.items?.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-100"
                                    >
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                          {item.name || `Item ${index + 1}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Qty: {item.quantity || 1}
                                        </p>
                                      </div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(
                                          (item.price || 0) *
                                            (item.quantity || 1)
                                        )}
                                      </div>
                                    </div>
                                  )) || (
                                    <p className="text-gray-500 text-sm">
                                      No items found
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : "No orders match your current filters."}
              </p>
              {orders.length === 0 ? (
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
                >
                  Browse Products
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
