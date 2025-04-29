import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingBag, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Modal = ({ isOpen, closeModal, product, onAddToCart , addToWishList }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  // This ensures a size is selected by default when the modal opens
  useEffect(() => {

    if (product && Array.isArray(product.size) && product.size.length > 0) {
      setSelectedSize(product.size[0]);
    }
  }, [product]);
  
 
  
  // Mock reviews data - would come from API in real implementation
  const reviews = [
    { id: 1, author: "Alex J.", rating: 5, text: "Extremely comfortable and stylish. Perfect fit!", date: "2 weeks ago" },
    { id: 2, author: "Morgan L.", rating: 4, text: "Great quality but runs slightly large.", date: "1 month ago" }
  ];
  
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              <FiX size={24} />
            </button>
            
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden bg-gray-100">
                {/* Main product image */}
                <div 
                  className={`relative ${isImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                  <motion.img
                    animate={{ 
                      scale: isImageZoomed ? 1.5 : 1,
                      transition: { duration: 0.3 }
                    }}
                    className="w-full h-96 lg:h-[600px] object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                  
                  {/* Zoom instruction */}
                  {!isImageZoomed && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Click to zoom</span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail navigation */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 text-gray-700 hover:text-gray-900 transition-all">
                    <FiChevronLeft size={16} />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 text-gray-700 hover:text-gray-900 transition-all">
                    <FiChevronRight size={16} />
                  </button>
                </div>
                
                {/* Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white font-medium text-sm px-3 py-1 rounded-md">
                    {product.discountPercentage}% OFF
                  </div>
                )}
              </div>
              
              {/* Product Info Section */}
              <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col h-full">
                {/* Brand & Product Name */}
                <div className="mb-4">
                  <div className="text-sm text-indigo-600 font-semibold tracking-wide uppercase mb-1">
                    Premium Collection
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-2xl font-bold text-gray-900">${product.price}.00</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      ${product.originalPrice}.00
                    </span>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">(128 reviews)</span>
                </div>
                
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                  <div className="flex space-x-6">
                    <button 
                      onClick={() => setActiveTab("details")}
                      className={`pb-2 text-sm font-medium ${
                        activeTab === "details" 
                          ? "text-indigo-600 border-b-2 border-indigo-600" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => setActiveTab("reviews")}
                      className={`pb-2 text-sm font-medium ${
                        activeTab === "reviews" 
                          ? "text-indigo-600 border-b-2 border-indigo-600" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Reviews
                    </button>
                    <button 
                      onClick={() => setActiveTab("delivery")}
                      className={`pb-2 text-sm font-medium ${
                        activeTab === "delivery" 
                          ? "text-indigo-600 border-b-2 border-indigo-600" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: "260px" }}>
                  {activeTab === "details" && (
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        {product.description || "Elevate your style with these premium shoes designed for both comfort and aesthetics. Features advanced cushioning technology and durable materials for long-lasting performance."}
                      </p>
                      
                     
                      
                     
                      {/* Features */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Highlights</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Premium materials for durability</li>
                          <li>Cushioned insole for all-day comfort</li>
                          <li>Breathable design keeps feet cool</li>
                          <li>Stylish profile for versatile wear</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-4">
                          <div className="flex justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{review.author}</h4>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{review.text}</p>
                        </div>
                      ))}
                      <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                        Read all reviews
                      </button>
                    </div>
                  )}
                  
                  {activeTab === "delivery" && (
                    <div className="space-y-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Free standard shipping</h4>
                          <p className="text-sm text-gray-600">4-5 business days</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Express delivery</h4>
                          <p className="text-sm text-gray-600">1-2 business days ($12.99)</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Return policy</h4>
                          <p className="text-sm text-gray-600">Free returns within 30 days</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-5 gap-3">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="col-span-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FiShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                  onClick={()=>addToWishList(product)}
                   className="col-span-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 focus:outline-none transition-all duration-300 flex items-center justify-center">
                    <FiHeart size={20} />
                  </button>
                </div>
                
                {/* Social & Extra Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button className="text-gray-400 hover:text-gray-500">
                      <FiShare2 size={20} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">SKU: {product.id || 'PRD-1234'}</div>
                </div>
              </div>
            </div>
            
            {/* Bottom recommendations - mobile only */}
            <div className="lg:hidden bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">You might also like</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {[1, 2, 3].map(item => (
                  <div key={item} className="flex-shrink-0 w-24">
                    <div className="bg-gray-200 w-24 h-24 rounded-lg mb-1"></div>
                    <p className="text-xs font-medium text-gray-900 truncate">Similar Product</p>
                    <p className="text-xs text-gray-500">$89.00</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default Modal;