import React, { useState, useEffect, useCallback } from "react";
import logo from "../assets/logo222.png";
import { RiShoppingCartLine, RiUser3Line, RiMenu2Fill, RiHeart2Fill } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUser } from "./userContext";
import toast from "react-hot-toast";
import axiosAuth from "../api/axiosAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showLogout, setShowLogout] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    if(user){

    
    try {
      axiosAuth.get(`/Cart/${user.id}`).then((response) => {
        if (response.data.statusCode == 200) {
          const cart = response.data.data.items;
          setCartCount(cart.length);
        }
      });

      axiosAuth.get(`/WishList/${user.id}`).then((res) => {
        const wishlist = res.data;
        setWishlistCount(wishlist.length);
      });
      setIsAdmin(user.id === 1);
    } catch (error) {
      toast.error("Failed to load cart information");
    }
  }
  });

  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !user) {
      toast.error("Please login to continue");
      return;
    }
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("id");
    localStorage.clear();
    navigate('/');
    window.location.reload();
    toast.success("Logged out successfully");
  };

  // Separate component for menu items to reduce repetition
  const NavItem = ({ text, path, requiresAuth = false }) => (
    <div
      className="text-white p-2 cursor-pointer hover:text-gray-900 hover:scale-110 transition-transform duration-300 ease-in-out"
      onClick={() => handleNavigation(path, requiresAuth)}
    >
      {text}
    </div>
  );

  // Mobile menu button component
  const MobileNavItem = ({ text, path, requiresAuth = false }) => (
    <button
      className="w-full rounded-none text-white py-2 bg-stone-400 hover:bg-gray-600"
      onClick={() => handleNavigation(path, requiresAuth)}
    >
      {text}
    </button>
  );

  return (
    <div className="sticky top-0 z-50 shadow-lg">
      <nav className="flex justify-between items-center p-4 w-full max-w-7xl mx-auto">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white bg-transparent focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <RiMenu2Fill size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center w-full md:w-auto ps-5">
          <img
            className="w-8 h-8 me-3 cursor-pointer hover:rotate-12 transition-all duration-300"
            onClick={() => navigate("/")}
            src={logo}
            alt="Plashoe Logo"
          />
          <h2
            onClick={() => navigate("/")}
            className="font-bold text-2xl text-white cursor-pointer tracking-widest hover:text-gray-300 transition-colors duration-300"
          >
            PLASHOE
          </h2>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 justify-center w-full">
          <NavItem text="Home" path="/" />

          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <NavItem text="Products" path="/products" />
            {showCategories && (
              <div className="absolute top-full left-0 bg-white z-20 shadow-lg rounded-lg p-3 w-64 transition-all duration-300 ease-in-out transform origin-top-left">
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2">Categories</h3>
                <ul className="space-y-1">
                  <li
                    className="cursor-pointer flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 group transition-all duration-200"
                    onClick={() => navigate("/products")}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Men</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400 group-hover:text-purple-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>

                  <li
                    className="cursor-pointer flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-700 group transition-all duration-200"
                    onClick={() => navigate("/products")}
                  >
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-pink-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Women</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400 group-hover:text-pink-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>

                </ul>
              </div>
            )}
          </div>

          <NavItem text="Orders" path="/orders" requiresAuth={true} />
          <NavItem text="Contact" path="/contact" />
          {isAdmin && <NavItem text="Admin" path="/dash" />}
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-4">
          {/* Wishlist */}
          <div
            onClick={() => handleNavigation("/wishlist", true)}
            className="text-white flex cursor-pointer hover:text-red-400 hover:scale-110 transition-all duration-300 ease-in-out relative"
            aria-label="Wishlist"
          >
            <RiHeart2Fill size={24} />
            {wishlistCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {wishlistCount}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            onClick={() => handleNavigation("/cart", true)}
            className="text-white flex cursor-pointer hover:text-blue-400 hover:scale-110 transition-all duration-300 ease-in-out relative"
            aria-label="Shopping cart"
          >
            <RiShoppingCartLine size={24} />
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {cartCount}
              </div>
            )}
          </div>

          {/* User greeting */}
          {user && (
            <div className="hidden md:flex">
              <p className="text-white font-medium">Hey, <span className="text-yellow-300">{user.name}</span>!</p>
            </div>
          )}

          {/* User profile/login */}
          <div
            className="relative"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            {user ? (
              <div className="text-white cursor-pointer hover:text-gray-300 hover:scale-110 transition-all duration-300 ease-in-out">
                <RiUser3Line size={24} />
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-gray-800 rounded-full px-4 py-1 text-sm font-medium hover:bg-gray-200 transition-all duration-300 ease-in-out"
              >
                Login
              </button>
            )}

            {showLogout && user && (
              <div className="absolute right-0 mt-2 bg-white z-20 shadow-lg rounded-lg w-36 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  <li
                    className="cursor-pointer hover:bg-gray-100 p-3 text-gray-800 flex items-center transition-colors duration-200"
                    onClick={() => navigate("/profile")}
                  >
                    <RiUser3Line className="mr-2" /> Profile
                  </li>
                  <li
                    className="cursor-pointer hover:bg-gray-100 p-3 text-gray-800 flex items-center transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 animate-fadeIn">
          <MobileNavItem text="Home" path="/" />
          <MobileNavItem text="Products" path="/products" />
          <MobileNavItem text="Orders" path="/orders" requiresAuth={true} />
          <MobileNavItem text="Contact" path="/contact" />
          {isAdmin && <MobileNavItem text="Admin" path="/dash" />}
          {!user && <MobileNavItem text="Login" path="/login" />}
          {user && (
            <button
              className="w-full rounded-none text-white py-2 bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export default Navbar;