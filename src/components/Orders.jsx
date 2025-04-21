import React, { useEffect, useState } from "react";
import { useUser } from "./userContext";
import Navbar from "./Navbar";
import axios from "axios";
import {
  PackageOpen,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Package,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import ProductViewModal from "../Base/ProductViewModal";

function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ item: null, status: "" });


  // const openProductModal = ( product) => {
  //   setProduct(product)
  //   setIsModalOpen(true);
  // };
  const openProductModal = (item, status) => {
    setSelectedProduct({ item, status });
    console.log(status)
    setIsModalOpen(true);
  };


  useEffect(() => {
    if (user) {
      axios
        .get(`https://localhost:7072/api/Order/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setOrders(res.data.data || []);
          toast.success(`${res.data.message}`);
        })
        .catch((err) => {
          toast.error("Failed to fetch orders.");
          console.error(err);
        });

    }
  }, [user]);

  const handleRemove = (orderId, e) => {
    e.stopPropagation();
    axios
      .delete(`https://localhost:7072/api/Order/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        toast.success(`${res.data.message}`);
        setOrders(orders.filter((order) => order.id !== orderId));
      })
      .catch(() => toast.error("Failed to cancel order."));
  };

  const getStatusIcon = (status) => {
    status = status || "placed";
    switch (status.toLowerCase()) {
      case "all":
        return <Package size={20} className="text-gray-200" />;
        case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;

      case "delivered":
        return <CheckCircle size={20} className="text-green-500" />;
      case "confirmed":
        return <PackageOpen size={20} className="text-yellow-500" />;
      case "placed":
      default:
        return <AlertCircle size={20} className="text-orange-500" />;
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
        (order) =>
          (order.status || "placed").toLowerCase() ===
          activeTab.toLowerCase()
      );
  console.log(filteredOrders)

  const toggleExpand = (index) => {
    setExpandedOrder(expandedOrder === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-100">
      <div className="bg-gray-300 shadow-md">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="relative mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 inline-block">
            Your Orders
            <div className="absolute -bottom-3 left-1/4 right-1/4 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"></div>
          </h1>
          <p className="text-gray-600 mt-6 max-w-xl mx-auto">
            Track and manage all your purchases in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 mb-8 pb-2">
          {["all", "placed", "confirmed","shipped", "delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab
                  ? `bg-${tab === "placed" ? "orange" : tab === "confirmed" ? "yellow" : tab === "delivered" ? "green" : "purple"
                  }-600 text-white shadow-lg shadow-${tab}-200`
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {getStatusIcon(tab)}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Order List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <PackageOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              You don't have any orders in this category yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {filteredOrders.map((order, index) => (
              <li
                key={order.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 transform hover:shadow-md ${expandedOrder === index
                    ? "ring-2 ring-purple-400 scale-100"
                    : "hover:scale-[1.01]"
                  }`}
              >
                <div onClick={() => toggleExpand(index)} className="cursor-pointer">
                  {/* Order Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-800">
                      <Calendar size={16} className="text-gray-500" />
                      {formatDate(order.orderDate)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100">
                        {getStatusIcon(order.status)}
                        <span className="font-medium">
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleRemove(order.id, e)}
                        className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {expandedOrder === index && (
                    <div className="p-6 space-y-4 bg-gray-50">
                      {order.orderItems.map((item, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                          onClick={() => openProductModal(item, order.status)}

                        >
                          <div>

                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {item.productName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total Price</p>
                            <p className="font-medium text-gray-800">
                              ₹ {item.totalPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t mt-4 text-right font-semibold text-lg text-gray-700">
                        Total Amount: ₹ {order.totalAmount}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ProductViewModal
        item={selectedProduct.item}
        status={selectedProduct.status}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}

export default Orders;
