import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle
} from "lucide-react";
import SideDash from "./SideDash";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState("all");



  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get("/Admin/all-orders");
      if (response.data.statusCode === 200) {
        setOrders(response.data.data);
      } else {
        setError("Failed to fetch orders: " + response.data.message);
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'placed':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'confirmed':
        return <RefreshCw className="w-4 h-4 text-purple-500" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'placed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosAuth.patch(`/Admin/Order-Status-Update/${orderId}/${newStatus}`).then((res)=>
      toast.success(res.data.message)
      )
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = [...orders]
    .filter(order => {
      // Filter by status if not "all"
      if (statusFilter !== "all" && order.status.toLowerCase() !== statusFilter) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.transactionId.toLowerCase().includes(searchLower) ||
          order.orderItems.some(item =>
            item.productName.toLowerCase().includes(searchLower)
          )
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'orderDate') {
        return sortConfig.direction === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (sortConfig.key === 'totalAmount') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      // For string values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Orders</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the latest order data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block md:w-64 bg-gray-800">
        <SideDash />
      </div>
      <div className="flex-1 mt-14">
        <div className="container mx-auto px-4 py-8 ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <ShoppingBag className="mr-2" /> Order Management
              </h1>
              <p className="text-gray-500 mt-1">View and manage all customer orders</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <div
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 cursor-pointer top-3"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={fetchOrders}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </button>
            </div>
          </div>

          {filteredAndSortedOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-500">
                {searchTerm
                  ? `No orders matching "${searchTerm}" were found.`
                  : statusFilter !== "all"
                    ? `No orders with status "${statusFilter}" were found.`
                    : "There are currently no orders in the system."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm text-gray-500 px-4">
                <p>Showing {filteredAndSortedOrders.length} orders</p>
                <div className="flex items-center">
                  <span className="mr-2">Sort by:</span>
                  <button
                    onClick={() => handleSort('orderDate')}
                    className={`mr-3 px-3 py-1 rounded transition-colors duration-200 
    ${sortConfig.key === 'orderDate'
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-black'}`}
                  >
                    Date {sortConfig.key === 'orderDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </button>

                  <button
                    onClick={() => handleSort('totalAmount')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${sortConfig.key === 'totalAmount'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    Amount {sortConfig.key === 'totalAmount' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {filteredAndSortedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div
                    className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-4">
                        <Package className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order #{order.id}</p>
                        <p className="text-lg font-semibold text-gray-900">{order.transactionId}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span>
                      </div>

                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium">${order.totalAmount.toFixed(2)}</span>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </div>

                      <button className="bg-indigo-50 text-indigo-600 p-1.5 rounded-full shadow-sm border border-indigo-100 transition-colors duration-200 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-200">
                        {expandedOrders[order.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {expandedOrders[order.id] && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="font-medium text-gray-700">Order Items ({order.orderItems.length})</h3>

                        <div className="flex space-x-2">
                          {order.status.toLowerCase() !== "delivered" && (
                            <div className="relative inline-block">
                              <select
                                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              >
                                <option value="placed">Placed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          )}

                          <button className="text-sm flex items-center bg-white text-indigo-600 font-medium px-3 py-1.5 rounded-md shadow-sm border border-indigo-200 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300">
                            <ExternalLink className="h-4 w-4 mr-1.5" /> View Details
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                              <th className="px-4 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-4 py-3 bg-gray-100 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.orderItems.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                  <div className="text-xs text-gray-500">ID: {item.productId}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                  ${item.totalPrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="2" className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-700">
                                Total:
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                ${order.totalAmount.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewOrders;