import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext.jsx";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Footer from "../Base/footer.jsx";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import toast from "react-hot-toast";
import axiosAuth from "../api/axiosAuth.jsx";

function Cart() {
  const { user, priceHandle, toPurchase } = useUser();
  const navigate = useNavigate();
  const [userCart, setUserCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (user) {
     getCart()
    }
  },[user,userCart]);

  const getCart=()=>{
    axiosAuth
    .get(`http://plashoe.runasp.net/api/Cart/${user.id}`)
    .then((response) => {
     
setPrice(response.data.data.totalPrice)
      setUserCart(response.data.data.items);
      setLoading(false);
    })
    .catch((error) => {
      setUserCart([])
      console.error("Error fetching user cart", error);
      setLoading(false);
    });
  }

  const handleRemove = (productId) => {

    axiosAuth
      .delete(`http://plashoe.runasp.net/api/Cart/remove/${user.id}/${productId}`)
      .then((res) => {
        console.log(res.data)
        toast.success(res.data.message)
        console.log(userCart)
        setUserCart(userCart.filter((p)=>p.id!=productId))
        // setUserCart(updatedCart);
      })
      .catch((error) => {
        console.error("Error updating the cart", error);
      });
  };

  const handleInc = (productId) => {

    axios
      .patch(`http://plashoe.runasp.net/api/Cart/increase/${user.id}/${productId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }).then((res)=>{
        console.log(res.data)
        getCart()
      })
  };

  const handleDec = (productId) => {
    axios
      .patch(`http://plashoe.runasp.net/api/Cart/decrease/${user.id}/${productId}`,{},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }).then((res)=>{
        console.log(res.data.message)
        // const type= d
        res.data.statusCode == 200? toast.success(res.data.message) : toast.error(res.data.message) 
        
        getCart()
      })
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-400 to-stone-200">
      <div className="">
      <Navbar />
        </div>
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 flex items-center">
            <ShoppingCart className="mr-3" />
            Your Cart
          </h1>
          {userCart.length > 0 && (
            <span className="bg-stone-800 text-white px-3 py-1 rounded-full text-sm">
              {userCart.length} {userCart.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-800 mb-4"></div>
            <p className="text-stone-600">Loading your cart...</p>
          </div>
        ) : userCart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center">
            <Package size={64} className="text-stone-400 mb-4" />
            <h2 className="text-2xl font-semibold text-stone-800 mb-2">Your cart is empty</h2>
            <p className="text-stone-500 mb-6 text-center">Looks like you haven't added any products to your cart yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-stone-800">Cart Items</h2>
                </div>
                
                <ul className="divide-y divide-stone-100">
                  {userCart.map((product, index) => (
                    <li key={index} className="p-6 transition-all hover:bg-stone-50">
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-stone-100 rounded-lg overflow-hidden mr-0 md:mr-6">
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow flex flex-col md:flex-row items-center md:items-start md:justify-between w-full">
                          <div className="text-center md:text-left mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-stone-800 mb-1">{product.productName}</h3>
                            {/* <p className="text-stone-500 text-sm mb-2">
                              Sizes: {product.size}
                            </p> */}
                            <p className="text-stone-800 font-bold">${product.price}.00</p>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-3">
                            <div className="flex items-center bg-stone-100 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDec(product.productId)}
                                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 font-medium text-stone-800">
                                {product.quantity}
                              </span>
                              <button
                                onClick={() => handleInc(product.productId)}
                                className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemove(product.productId)}
                              className="flex items-center text-stone-500 hover:text-red-500 text-sm transition-colors"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-5">
                <div className="p-6 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-stone-800">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal ({userCart.length} items)</span>
                      <span>${price}.00</span>
                    </div>
                    
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-100">
                      <div className="flex justify-between text-lg font-semibold text-stone-800">
                        <span>Total</span>
                        <span>${price}.00</span>
                      </div>
                      <div className="text-stone-500 text-sm mt-1">
                        Estimated delivery: {getEstimatedDelivery()}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        priceHandle(price)
                        navigate("/payment");
                        toPurchase(userCart);
                      }}
                      className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-4 rounded-lg mt-4 flex items-center justify-center transition duration-300"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2" size={18} />
                    </button>
                    
                    <button
                      onClick={() => navigate("/products")}
                      className="w-full text-stone-600 hover:text-stone-800 font-medium py-2 rounded-lg mt-2 text-center transition duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Cart;