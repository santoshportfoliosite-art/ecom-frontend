// OrderTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  User,
  ShoppingBag,
  Package,
  Truck,
  RefreshCw,
  XCircle,
  ShoppingCart,
  Hash,
  Layers,
  Tag,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from "lucide-react";

const OrderTable = ({ 
  orders, 
  expandedRows, 
  selectedOrders, 
  statusOptions, 
  paymentStatusOptions,
  onToggleRowExpand,
  onToggleSelectOrder,
  onSelectAllOrders,
  onView,  // Add this prop
  onEdit,
  onDelete,
  formatDate
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <RefreshCw className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-emerald-800/30 bg-gradient-to-br from-gray-900/50 via-emerald-900/20 to-gray-900/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-800/20">
          <thead className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onChange={onSelectAllOrders}
                  className="rounded border-emerald-700/50 bg-gray-900/50 text-emerald-500 focus:ring-emerald-500/50"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-800/10">
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr 
                  className={`transition-all duration-200 ${
                    hoveredRow === order._id 
                      ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/20' 
                      : 'bg-transparent'
                  }`}
                  onMouseEnter={() => setHoveredRow(order._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order._id)}
                      onChange={() => onToggleSelectOrder(order._id)}
                      className="rounded border-emerald-700/50 bg-gray-900/50 text-emerald-500 focus:ring-emerald-500/50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-emerald-200">
                      {order.shippingAddress?.fullName}
                    </div>
                    <div className="text-sm text-emerald-300/70">
                      {order.shippingAddress?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-300/70">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-emerald-100">
                      ₹{order.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-emerald-300/50">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                      order.status === "processing" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                      order.status === "shipped" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                      order.status === "delivered" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      order.status === "cancelled" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                      "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                    }`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {statusOptions.find(s => s.value === order.status)?.label || order.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "paid" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      order.paymentStatus === "pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                      order.paymentStatus === "failed" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                      "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                    }`}>
                      {order.paymentStatus === "paid" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {paymentStatusOptions.find(s => s.value === order.paymentStatus)?.label || order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(order)}  // Add View button
                        className="p-1.5 bg-emerald-900/30 hover:bg-emerald-800/50 rounded-lg border border-emerald-800/30 transition-colors group"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                      </button>
                      <button
                        onClick={() => onToggleRowExpand(order._id)}
                        className="p-1.5 bg-emerald-900/30 hover:bg-emerald-800/50 rounded-lg border border-emerald-800/30 transition-colors group"
                        title="View Details"
                      >
                        {expandedRows.has(order._id) ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(order)}
                        className="p-1.5 bg-emerald-900/30 hover:bg-emerald-800/50 rounded-lg border border-emerald-800/30 transition-colors group"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                      </button>
                      <button
                        onClick={() => onDelete(order)}
                        className="p-1.5 bg-red-900/30 hover:bg-red-800/50 rounded-lg border border-red-800/30 transition-colors group"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.has(order._id) && (
                  <tr key={`${order._id}-details`}>
                    <td colSpan="8" className="px-6 py-4 bg-gradient-to-r from-emerald-900/10 to-teal-900/10">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      >
                        {/* Left Column: Shipping Info and Order Details */}
                        <div className="space-y-6">
                          {/* Shipping Info */}
                          <div className="bg-gradient-to-br from-gray-800/40 to-emerald-900/20 rounded-lg p-4 border border-emerald-800/20">
                            <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Shipping Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <div>
                                  <p className="text-sm text-emerald-300/70">Name</p>
                                  <p className="text-emerald-200 font-medium">{order.shippingAddress?.fullName}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <div>
                                  <p className="text-sm text-emerald-300/70">Phone</p>
                                  <p className="text-emerald-200 font-medium">{order.shippingAddress?.phone}</p>
                                </div>
                              </div>
                              {order.shippingAddress?.email && (
                                <div className="flex items-start gap-3">
                                  <Mail className="w-4 h-4 text-emerald-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-emerald-300/70">Email</p>
                                    <p className="text-emerald-200 font-medium">{order.shippingAddress.email}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <div>
                                  <p className="text-sm text-emerald-300/70">Address</p>
                                  <p className="text-emerald-200 font-medium">
                                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, 
                                    {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="bg-gradient-to-br from-gray-800/40 to-emerald-900/20 rounded-lg p-4 border border-emerald-800/20">
                            <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4" />
                              Order Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-emerald-300/70">Payment Method</p>
                                <p className="text-emerald-200 font-medium">{order.paymentMethod?.toUpperCase() || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-emerald-300/70">Delivery Option</p>
                                <p className="text-emerald-200 font-medium">{order.deliveryOption || "Standard"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-emerald-300/70">Subtotal</p>
                                <p className="text-emerald-200 font-medium">₹{order.subtotal?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-emerald-300/70">Tax</p>
                                <p className="text-emerald-200 font-medium">₹{order.tax?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-emerald-300/70">Shipping</p>
                                <p className="text-emerald-200 font-medium">₹{order.shipping?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div className="col-span-2 pt-2 border-t border-emerald-800/30">
                                <p className="text-sm text-emerald-300/70">Total</p>
                                <p className="text-lg font-bold text-emerald-100">₹{order.total?.toFixed(2) || "0.00"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Ordered Items */}
                        <div>
                          <div className="bg-gradient-to-br from-gray-800/40 to-emerald-900/20 rounded-lg p-4 border border-emerald-800/20 h-full">
                            <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Ordered Items ({order.items?.length || 0})
                            </h4>
                            
                            {order.items && order.items.length > 0 ? (
                              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {order.items.map((item, index) => (
                                  <div 
                                    key={index}
                                    className="p-3 rounded-lg bg-gradient-to-r from-gray-900/30 to-emerald-900/10 border border-emerald-800/20"
                                  >
                                    <div className="flex gap-3">
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
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <p className="font-medium text-emerald-200 truncate">{item.name}</p>
                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
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
                                          <p className="text-emerald-300 font-bold ml-2">₹{item.price?.toFixed(2) || "0.00"}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                          <div className="flex items-center gap-4 flex-wrap">
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
                                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                          </p>
                                        </div>
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

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
          <p className="text-emerald-300/70">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable;