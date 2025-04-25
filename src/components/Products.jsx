import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import { useProductContext } from "./ProductContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Base/footer";
import { IoCloseCircle, IoSearchCircle } from "react-icons/io5";
import { FiFilter, FiX, FiShoppingBag, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import Modal from "../Base/modal";
import Swal from "sweetalert2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosAuth from "../api/axiosAuth";

// Product Card with Animation

const ProductCard = ({ product, onProductClick, onAddToCart, addToWishList, findWish }) => {


  const randomRating = [3, 4, 5][Math.floor(Math.random() * 3)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={product.productId}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden group"
        onClick={() => onProductClick(product)}>
        <img

          className="w-full h-56 object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12"
          src={product.image}
          alt={product.productName}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center bg-white/90 h-10 w-10 hover:w-auto backdrop-blur-sm hover:bg-white text-gray-900 rounded-full p-3 transform translate-y-10 group-hover:translate-y-0 transition-all duration-150 ease-in group/cart"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={18} className="transition-all duration-300" />
            <span className="max-w-0  overflow-hidden opacity-0 group-hover:opacity-70 whitespace-nowrap group-hover/cart:max-w-xs group-hover/cart:ml-2 transition-all duration-1000 ease-in-out">
              Add to Cart
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToWishList(product)
            }
            }
            className="bg-white/90 backdrop-blur-sm hover:text-red-600 hover:bg-white text-gray-900 rounded-full p-3 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300"
            aria-label="Add to wishlist"
          >
            {findWish(product.productId) ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>
        {product.discountPercentage && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>

      <div
        onClick={() => onProductClick(product)}
        className="p-5 flex-grow cursor-pointer"
      >
        <h3 className="text-lg font-medium mb-2 text-gray-800">{product.productName}</h3>
        <p className="text-gray-500 text-sm mb-2 font-light">
         click for view more
      </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">${product.price}.00</p>

          <div className="flex space-x-1">

            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= randomRating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Button Component
const FilterButton = ({ active, label, onClick }) => (
  <button
    className={`text-sm font-medium px-4 py-2.5 transition-all duration-200 ${active
        ? "bg-gray-800 text-white rounded-lg shadow-lg"
        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md rounded-lg"
      }`}
    onClick={onClick}
  >
    {label}
  </button>
);

function Products() {
  const { user } = useUser();
  const { filterProducts, filterByCategory, toSearch, isLoading: productsLoading } = useProductContext();
  const navigate = useNavigate();
  const [cate, setCate] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [wishList, setWishList] = useState([])

  const findInWishList = (productId) => {
    return wishList.some(item => item.productId === productId);
  };
  useEffect(() => {
    const userId = localStorage.getItem("id")

    axiosAuth.get(`api/WishList/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      setWishList(res.data)
    })

    if (filterProducts) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500)
    }
  }, [user])



  const filteredProducts = useMemo(() => {
    if (!priceFilter) return filterProducts;

    return filterProducts.filter(product => {
      const price = Number(product.price);
      switch (priceFilter) {
        case 'under50':
          return price < 50;
        case '50to100':
          return price >= 50 && price <= 100;
        case 'over100':
          return price > 100;
        default:
          return true;
      }
    });
  }, [filterProducts, priceFilter]);

  function handleCategoryFilter(category) {
    setCate(category === "Men" ? "Men's" : category === "Women" ? "Women's" : "All");
    filterByCategory(category);
    setPriceFilter(null);
  }

  function addToWishList(product) {
    const userId = localStorage.getItem("id");
    const productId = product.productId;

    if (userId === null) 
      return showLoginPrompt();


    setWishList(prev => [...prev, { productId }]);

    axiosAuth.post(`/Wishlist/add`, {}, {
      params: {
        productId,
        userId,
      },
    })
      .then((res) => {
        toast.success(res.data);
        axiosAuth.get(`/WishList/${userId}`).then((res) => {
          setWishList(res.data);
        })


      })
  }

  function handleProductClick(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function addToCart(product) {
    if (user) {
      const userId = localStorage.getItem("id");
      console.log(product)
      setIsLoading(true);
      axiosAuth.post(`/Cart/add/${userId}/${product.productId}`)

        .then((res) => {
          console.log(res.data)
          setIsLoading(false);
          toast.success(`${res.data.message}`, {
            icon: '🛒',
            duration: 3000
          });
        })
        .catch((error) => {
          console.error("Failed to update cart:", error);
          toast.error("Failed to add to cart", { duration: 4000 });
        })
        .finally(() => {
          setIsLoading(false);
        });

    } else {
      showLoginPrompt();
    }
  }

  function showLoginPrompt() {
    Swal.fire({
      html: `
        <div class="relative w-full p-0 overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute -top-10 -right-10 w-40  h-40 bg-blue-400/20 rounded-full blur-xl"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
          
          <!-- Title with custom styling -->
          <div class="flex flex-col items-center p-0">
            <div class="w-16 h-16 mb-4 mt-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Authentication Required</h2>
            <p class="text-gray-500 mt-2 mb-6">Sign in to add items to your cart</p>
          </div>
          
          <!-- Custom notification box -->
          <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 text-left">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-amber-700">
                  You need to be logged in to complete this action
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      width: 500,
      padding: '2rem',
      background: '#ffffff',
      backdrop: `
        rgba(0,0,10,0.6)
        backdrop-filter: blur(4px)
      `,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster',
      },
      footer: `
        <div class="w-full grid grid-cols-1 gap-3 mt-2">
          <button id="login-btn" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:text-gray-300 font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" aria-label="Log in">
            <span class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Log in
            </span>
          </button>
          <button id="signup-btn" class="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:text-gray-300 font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" aria-label="Create account">
            <span class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Create account
            </span>
          </button>
          <button id="guest-btn" class="w-full flex items-center justify-center text-gray-500 hover:text-gray-800 font-medium py-2 mt-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Continue as guest">
            Continue as guest
          </button>
        </div>
      `,
      willOpen: () => {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const guestBtn = document.getElementById('guest-btn');
  
        loginBtn.addEventListener('click', () => {
          Swal.close();
          navigate('/login');
        });
  
        signupBtn.addEventListener('click', () => {
          Swal.close();
          navigate('/signup');
        });
  
        guestBtn.addEventListener('click', () => {
          Swal.close();
        });
      },
    });
  }
  // Reset all filters function
  function resetAllFilters() {
    setPriceFilter(null);
    setSearchValue("");
    handleCategoryFilter("All");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <div className="bg-gray-500/40 shadow-sm">
        <Navbar />
      </div> */}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-500 pb-8 ">
        <Navbar />
        <div className="container mx-auto px-4 pt-16 text-white ">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Fit</h1>
          <p className="text-gray-300 text-md max-w-xl mx-auto">Discover premium footwear crafted for style and comfort. Our collection features the latest trends and timeless classics.</p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="sticky top-0 z-20 bg-gray-100 shadow-md backdrop-blur-lg bg-opacity-80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <FilterButton
                active={cate === "All"}
                label="All Products"
                onClick={() => handleCategoryFilter("All")}
              />
              <FilterButton
                active={cate === "Men's"}
                label="Men's"
                onClick={() => handleCategoryFilter("Men")}
              />
              <FilterButton
                active={cate === "Women's"}
                label="Women's"
                onClick={() => handleCategoryFilter("Women")}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${showFilters
                    ? "bg-gray-800 text-white"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
              >
                <FiFilter size={16} />
                <span>Filters</span>
              </button>
            </div>

            <div className="relative w-full md:w-64 lg:w-80">
              <input
                className="w-full p-2.5 pl-4 pr-12 bg-white text-gray-800  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-200"
                placeholder="Search products..."
                type="text"
                value={searchValue}
                onChange={(e) => {
                  toSearch(e.target.value)
                  setSearchValue(e.target.value)
                }}
                onKeyPress={(e) => e.key === 'Enter' && toSearch(searchValue)}
              />
              {!searchValue && (

                <button
                  className="absolute p-0 rounded-3xl  bg-transparent hover:bg-transparent right-2 top-1/2 transform -translate-y-1/2"
                  aria-label="Search"
                >
                  <IoSearchCircle size={32} className="text-gray-700 hover:text-gray-500 m-2 transition-colors" />
                </button>
              )}
              {searchValue && (
                <button
                  onClick={() => {
                    toSearch("")
                    setSearchValue("")
                  }}
                  className="absolute p-0 rounded-3xl  bg-transparent hover:bg-transparent right-2 top-1/2 transform -translate-y-1/2"
                  aria-label="Search"
                >
                  <IoCloseCircle size={32} className="text-gray-700 hover:text-gray-500 m-2 transition-colors" />
                </button>
              )

              }
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-5 rounded-xl shadow-lg mt-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-800 font-medium">Refine Your Search</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPriceFilter('under50')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priceFilter === 'under50'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      Under $50
                    </button>
                    <button
                      onClick={() => setPriceFilter('50to100')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priceFilter === '50to100'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      $50 - $100
                    </button>
                    <button
                      onClick={() => setPriceFilter('over100')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priceFilter === 'over100'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                      Over $100
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(priceFilter || searchValue || cate !== "All") && (
                      <button
                        onClick={resetAllFilters}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {cate} Footwear Collection
            </h2>
            <p className="text-gray-500 font-medium">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isLoading || productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-4 text-lg font-medium text-gray-900">No products found</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
              <button
                onClick={resetAllFilters}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onProductClick={handleProductClick}
                  onAddToCart={addToCart}
                  addToWishList={addToWishList}
                  findWish={findInWishList}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
        addToWishList={addToWishList}
      />

      <Footer />
    </div>
  );
}

export default Products;