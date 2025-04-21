import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from './Navbar';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id")

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token")
        
        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`https://localhost:7072/api/WishList/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setWishlistItems(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again later.');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token')
      
      await axios.delete(`https://localhost:7072/api/WishList/delete`, {
        params: { userId, productId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
      toast.success("Product Removed From WishList")
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist.');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const userId = localStorage.getItem("id");
      console.log(productId)
        // setIsLoading(true);
        axios.post(`https://localhost:7072/api/Cart/add/${userId}/${productId}`,
          {},
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        })
     
          .then((res) => {
            console.log(res.data)
            toast.success(`${res.data.message}`, { 
              icon: '🛒',
              duration: 3000
            });
          })
          .catch((error) => {
            console.error("Failed to update cart:", error);
            toast.error("Failed to add to cart", { duration: 4000 });
            setError("Failed To Add to Cart")
          })
          

    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart.');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
    <div className='bg-violet-300'>

        <Navbar/>
    </div>
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 text-purple-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your wishlist to save them for later</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden group">
                <img 
                  src={item.products?.image} 
                  alt={item.products?.name || "Product"} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleViewProduct(item.productId)}
                    className="px-4 py-2 bg-white text-gray-800 rounded-lg m-2 hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                  {item.products.productName}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-purple-600">
                    ₹{item.products?.price || 0}
                  </span>
                  {item.products && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{(item.products?.price * 2) }
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-grow mr-2"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="flex items-center justify-center p-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default WishList;