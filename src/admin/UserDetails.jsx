import React, { useEffect, useState } from "react";
import SideDash from "./SideDash";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  ShieldAlert,
  Trash2,
  Eye,
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  UserCheck,
  UserX
} from "lucide-react";
import axiosAuth from "../api/axiosAuth";

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axiosAuth
      .get("/user/all")
      .then((response) => {
        const filteredUsers = response.data.filter((user) => user.id != "1");
        setUsers(filteredUsers);
        setLoading(false);
      })
      .catch((err) => {
        if(err.status ==403){
          setError("User Can't Acces This Page");
        }else{
          setError("Unable to fetch user data. Please try again later.");
        }
        setLoading(false);
        console.log("Error fetching users:", err);
      });
  };

  const handleBlock = (userId, userName, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";

    Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} user`,
      cancelButtonText: "Cancel",
      confirmButtonColor: currentStatus ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuth.patch(`/user/toggle-block/${userId}`).then((res) => {
          if (res.data.message) {
            toast.success(`${res.data.message}`);
            fetchUsers();
          }
        }).catch(err => {
          toast.error(`Failed to ${action} user. Please try again.`);
        });
      }
    });
  };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: "Delete User Account",
      text: `Are you sure you want to permanently delete ${userName}'s account? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuth
          .delete(`/user/${userId}`)
          .then(() => {
            setUsers(users.filter((user) => user.id !== userId));
            Swal.fire({
              title: "Account Deleted",
              text: `${userName}'s account has been permanently removed.`,
              icon: "success",
              confirmButtonColor: "#3B82F6"
            });
          })
          .catch((err) => {
            setError("Error deleting user");
            Swal.fire({
              title: "Deletion Failed",
              text: "There was an issue deleting this user account. Please try again.",
              icon: "error",
              confirmButtonColor: "#3B82F6"
            });
          });
      }
    });
  };

  const handleViewDetails = (user) => {
    Swal.fire({
      title: null,
      html: `
        <div class="text-left">
          <div class="flex items-center justify-center mb-4">
            <div class="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span class="text-white text-2xl font-bold">${user.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          
          <h2 class="text-xl font-bold mb-2 text-center text-gray-800">${user.name}</h2>
          <p class="text-center text-gray-500 text-sm mb-6">${user.email}</p>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <span class="font-medium text-gray-500">User ID</span>
              <span class="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">${user.id}</span>
            </div>
            
            <div class="flex justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <span class="font-medium text-gray-500">Full Name</span>
              <span class="text-gray-900 font-medium">${user.name}</span>
            </div>
            
            <div class="flex justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <span class="font-medium text-gray-500">Email Address</span>
              <span class="text-gray-900">${user.email}</span>
            </div>
            
            <div class="flex justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <span class="font-medium text-gray-500">Account Status</span>
              <span class="px-3 py-1 rounded-full text-xs font-medium ${
                user.isBlocked 
                  ? "bg-red-100 text-red-800 border border-red-200" 
                  : "bg-green-100 text-green-800 border border-green-200"
              }">
                ${user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>Last login: Today</span>
            <span class="cursor-pointer text-indigo-600 hover:text-indigo-800" onclick="copyToClipboard('${user.id}')">Copy ID</span>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#4F46E5",
      width: "420px",
      padding: "1.5rem",
      customClass: {
        container: 'user-details-popup',
        confirmButton: 'rounded-lg px-6'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      },
      didOpen: () => {
        // Add this function to the page to enable the copy ID feature
        if (!window.copyToClipboard) {
          window.copyToClipboard = function(text) {
            navigator.clipboard.writeText(text).then(() => {
              const copyButton = document.querySelector('.text-indigo-600');
              const originalText = copyButton.textContent;
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = originalText;
              }, 2000);
            });
          };
        }
      }
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block md:w-64 bg-gray-800">
          <SideDash />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen  bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center">
              <div className="bg-red-100 p-3 rounded-full">
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800">Error Loading Users</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="mt-3 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex min-h-screen">
        <div className="hidden md:block md:w-64 bg-gray-800">
          <SideDash />
        </div>

        <div className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-500 mt-1">Manage and monitor user accounts</p>
              </div>
              <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <div
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? `No users match your search for "${searchTerm}"`
                        : "There are no users registered in the system."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort("name")}
                          >
                            <div className="flex justify-center items-center">
                              <span>Name</span>
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort("email")}
                          >
                            <div className="flex justify-center items-center">
                              <span>Email</span>
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-right  text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-600 font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {user.isBlocked ? (
                                  <UserX className="w-3 h-3 mr-1 mt-1" />
                                ) : (
                                  <UserCheck className="w-3 h-3 mr-1 mt-1" />
                                )}
                                {user.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleBlock(user.id, user.name, user.isBlocked)}
                                  className={`${user.isBlocked
                                      ? "text-green-600 hover:text-green-900 bg-green-50"
                                      : "text-amber-600 hover:text-amber-900 bg-amber-50"
                                    } p-1.5 rounded-md transition-colors`}
                                  title={user.isBlocked ? "Unblock User" : "Block User"}
                                >
                                  {user.isBlocked ? (
                                    <Shield className="w-4 h-4" />
                                  ) : (
                                    <ShieldAlert className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id, user.name)}
                                  className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-center text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
              {searchTerm && ` (filtered from ${users.length} total users)`}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserDetails;