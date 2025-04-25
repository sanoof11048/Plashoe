import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Star, Check, AlertCircle } from 'lucide-react';

const ProductViewModal = ({ item, status, isOpen, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && item) {
            setLoading(true);
            setError(null);
            axiosAuth.get(`/Product/${item.productId}`)
                .then(response => {
                    setProduct(response.data);
                    console.log(response.data)
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching product:', err);
                    setError('Failed to load product details');
                    setLoading(false);
                });
        }
    }, [isOpen, item]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64 text-red-500">
                        <AlertCircle className="mr-2" />
                        {error}
                    </div>
                ) : product ? (
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-6">
                            <div className="bg-gray-50 rounded-lg mb-4 h-80 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-contain h-full w-full"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-6 flex flex-col">
                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold text-gray-800">{product.productName}</h2>
                                </div>

                                <div className="flex items-center mt-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < (product.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {product.reviewCount || 20} reviews
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.oldPrice && (
                                        <span className="ml-2 text-lg text-gray-500 line-through">₹{product.oldPrice}</span>
                                    )}
                                </div>

                                {product.stock ? (
                                    <div className="flex items-center text-sm text-green-500 mt-2">
                                        <Check size={16} className="mr-1" />
                                        In Stock
                                    </div>
                                ) : (
                                    <div className="flex items-center text-sm text-red-500 mt-2">
                                        <AlertCircle size={16} className="mr-1" />
                                        Out of Stock
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div className="mb-6">
                                    {/* Quantity and Total */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <span className="text-sm font-medium text-gray-500">Qty</span>
                                                <span className="block text-lg font-semibold text-gray-800 text-center">
                                                    {item.quantity}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                <span className="block">Price per unit</span>
                                                <span className="font-medium text-gray-700">₹{product.price}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-sm text-gray-500 block">Item Total</span>
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{item.quantity * product.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Status */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${status === 'delivered' ? 'bg-green-500' :
                                                status === 'shipped' ? 'bg-blue-500' :
                                                    status === 'processing' ? 'bg-yellow-500' :
                                                        'bg-gray-400'
                                                }`}></div>
                                            <span className="text-sm font-medium text-gray-500">Status</span>
                                        </div>
                                        <span className={`text-sm font-semibold ${status === 'delivered' ? 'text-green-600' :
                                            status === 'shipped' ? 'text-blue-600' :
                                                status === 'processing' ? 'text-yellow-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        Product not found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductViewModal;