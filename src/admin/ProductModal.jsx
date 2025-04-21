import React, { useState, useEffect } from 'react';
import axiosAuth from '../api/axiosAuth';

const ProductViewModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      fetchProductDetails(productId)
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load product details');
          setLoading(false);
        });
    }
  }, [isOpen, productId]);

  const fetchProductDetails = async (id) => {
    axiosAuth.get(`/Product/${id}`).then((res)=>{
        console.log(res.data)
        setProduct(res.data)
    })

  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <div 
            onClick={onClose}
            className="text-gray-500 cursor-pointer p-2 m-0 hover:text-gray-700"
          >
            ×
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : product ? (
            <div>
              <div className="flex justify-center mb-4">
                <img 
                  src={product.image || "/api/placeholder/200/200"} 
                  alt={product.name}
                  className="h-48 object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium">{product.productName}</h3>
                  <span className="text-green-600 font-bold text-xl">${product.price.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Category:</div>
                  <div>{product.category == 1? "Men" : "Women"}</div>
                  
                  <div className="font-medium">Stock:</div>
                  <div>{product.stock} units</div>
                  
                  <div className="font-medium">Product ID:</div>
                  <div>{product.productId}</div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Description:</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">No product found</div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;