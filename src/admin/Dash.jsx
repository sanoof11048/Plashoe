<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import SideDash from "./SideDash";
import { motion } from "framer-motion";
import { useUser } from "../components/userContext";
import NotFoundPage from "../components/404/404";
import axiosAuth from "../api/axiosAuth";
import { isTokenExpired } from "../api/isTokenExp";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Clock,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

function Dash() {
  const [usersCount, setUsersCount] = useState(0);
  const [revenueData, setRevenueData] = useState(0);
  const [orderData, setOrderData] = useState({
    count: 0,
    totalProductsOrdered: 0,
    pendingOrdersCount: 0
  });
  const [ordersList, setOrdersList] = useState([]);
  const [timeframe, setTimeframe] = useState("weekly");

  const { user } = useUser();

  useEffect(() => {
    if (user && user.id == 1) {
      axiosAuth.get("/user/all")
        .then((res) => {
          setUsersCount(res.data.length - 1);
        })
        .catch((err) => console.log(err));

      axiosAuth.get("/Admin/all-orders").then((res) => {
        const orders = res.data.data;
        setOrdersList(orders);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalProductsOrdered = orders.reduce((count, order) => {
          return count + order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        const pendingOrdersCount = orders.filter(order => order.status !== "delivered").length;

        setOrderData({
          count: totalOrders,
          totalProductsOrdered,
          pendingOrdersCount
        });
        setRevenueData(totalRevenue);
      });
    }
  }, [user]);

  const isTokenExp = isTokenExpired();
  if (!user || user.id != 1 || isTokenExp) {
    return <NotFoundPage />;
  }

  const percentageChanges = {
    users: 12.5,
    orders: 8.2,
    revenue: 15.7,
    products: -3.4,
    pending: 5.9
  };

  const StatCard = ({ title, value, icon, change, color }) => {
    const isPositive = change >= 0;
    return (
      <motion.div 
        className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300`}
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold mb-2">{value}</h3>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {title != "Pending Orders" &&(
<>
                {isPositive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="font-medium ml-1">{Math.abs(change)}%</span>
                <span className="text-gray-400 ml-1">vs last {timeframe}</span>
                </>
              )
              }
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('border', 'bg').replace('-500', '-100')}`}>
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  const timeframeOptions = ["daily", "weekly", "monthly"];

  const revenueChartData = ordersList?.slice(0, 7).map((order, idx) => ({
    name: `#${idx + 1}`,
    revenue: order.totalAmount
  }));

  const statusCounts = ordersList.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
  const pieColors = ["#34D399", "#FBBF24", "#F87171", "#60A5FA"];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/5 bg-gray-900 text-white">
        <SideDash />
      </div>

      <div className="w-4/5 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex space-x-2">
              {timeframeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setTimeframe(option)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timeframe === option 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Users" value={usersCount} icon={<Users size={24} className="text-blue-500" />} change={percentageChanges.users} color="border-blue-500" />
            <StatCard title="Total Orders" value={orderData.count} icon={<TrendingUp size={24} className="text-indigo-500" />} change={percentageChanges.orders} color="border-indigo-500" />
            <StatCard title="Total Revenue" value={`$${revenueData.toLocaleString()}`} icon={<DollarSign size={24} className="text-green-500" />} change={percentageChanges.revenue} color="border-green-500" />
            <StatCard title="Products Ordered" value={orderData.totalProductsOrdered} icon={<Package size={24} className="text-amber-500" />} change={percentageChanges.products} color="border-amber-500" />
            <StatCard title="Pending Orders" value={orderData.pendingOrdersCount} icon={<Clock size={24} className="text-red-500" />} change={percentageChanges.pending} color="border-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Revenue Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Order Status</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

=======
import React, { useEffect, useState } from "react";
import SideDash from "./SideDash";
import { motion } from "framer-motion";
import { useUser } from "../components/userContext";
import NotFoundPage from "../components/404/404";
import axiosAuth from "../api/axiosAuth";
import { isTokenExpired } from "../api/isTokenExp";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Clock,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

function Dash() {
  const [usersCount, setUsersCount] = useState(0);
  const [revenueData, setRevenueData] = useState(0);
  const [orderData, setOrderData] = useState({
    count: 0,
    totalProductsOrdered: 0,
    pendingOrdersCount: 0
  });
  const [ordersList, setOrdersList] = useState([]);
  const [timeframe, setTimeframe] = useState("weekly");

  const { user } = useUser();

  useEffect(() => {
    if (user && user.id == 1) {
      axiosAuth.get("/user/all")
        .then((res) => {
          setUsersCount(res.data.length - 1);
        })
        .catch((err) => console.log(err));

      axiosAuth.get("/Admin/all-orders").then((res) => {
        const orders = res.data.data;
        setOrdersList(orders);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalProductsOrdered = orders.reduce((count, order) => {
          return count + order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        const pendingOrdersCount = orders.filter(order => order.status !== "delivered").length;

        setOrderData({
          count: totalOrders,
          totalProductsOrdered,
          pendingOrdersCount
        });
        setRevenueData(totalRevenue);
      });
    }
  }, [user]);

  const isTokenExp = isTokenExpired();
  if (!user || user.id != 1 || isTokenExp) {
    return <NotFoundPage />;
  }

  const percentageChanges = {
    users: 12.5,
    orders: 8.2,
    revenue: 15.7,
    products: -3.4,
    pending: 5.9
  };

  const StatCard = ({ title, value, icon, change, color }) => {
    const isPositive = change >= 0;
    return (
      <motion.div 
        className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300`}
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold mb-2">{value}</h3>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {title != "Pending Orders" &&(
<>
                {isPositive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="font-medium ml-1">{Math.abs(change)}%</span>
                <span className="text-gray-400 ml-1">vs last {timeframe}</span>
                </>
              )
              }
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('border', 'bg').replace('-500', '-100')}`}>
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  const timeframeOptions = ["daily", "weekly", "monthly"];

  const revenueChartData = ordersList?.slice(0, 7).map((order, idx) => ({
    name: `#${idx + 1}`,
    revenue: order.totalAmount
  }));

  const statusCounts = ordersList.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
  const pieColors = ["#34D399", "#FBBF24", "#F87171", "#60A5FA"];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/5 bg-gray-900 text-white">
        <SideDash />
      </div>

      <div className="w-4/5 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex space-x-2">
              {timeframeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setTimeframe(option)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timeframe === option 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Users" value={usersCount} icon={<Users size={24} className="text-blue-500" />} change={percentageChanges.users} color="border-blue-500" />
            <StatCard title="Total Orders" value={orderData.count} icon={<TrendingUp size={24} className="text-indigo-500" />} change={percentageChanges.orders} color="border-indigo-500" />
            <StatCard title="Total Revenue" value={`$${revenueData.toLocaleString()}`} icon={<DollarSign size={24} className="text-green-500" />} change={percentageChanges.revenue} color="border-green-500" />
            <StatCard title="Products Ordered" value={orderData.totalProductsOrdered} icon={<Package size={24} className="text-amber-500" />} change={percentageChanges.products} color="border-amber-500" />
            <StatCard title="Pending Orders" value={orderData.pendingOrdersCount} icon={<Clock size={24} className="text-red-500" />} change={percentageChanges.pending} color="border-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Revenue Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Order Status</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

>>>>>>> 8ba31eefe9bb0b3b77c489ebabe5fde817c4117c
export default Dash;