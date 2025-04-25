import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import CreditBg from '../assets/png2.jpeg'
import { CheckCircle } from 'lucide-react'

function Credits() {
  const navigate = useNavigate()
  
  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById('success-container');
      if (element) element.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(${CreditBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15
        }}
      />
      
      {/* <Navbar /> */}
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div 
          id="success-container"
          className="w-full max-w-lg transform transition-all duration-700 opacity-0 translate-y-4"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Success header */}
            <div className="bg-green-600 p-6 flex justify-center">
              <CheckCircle size={80} className="text-white" />
            </div>
            
            {/* Content */}
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your purchase from <span className="font-semibold text-blue-600">plashoe.com</span>
              </p>
              
              {/* Order details summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">ORDER SUMMARY</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Order number:</span>
                  <span className="font-medium">#PLS-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment method:</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-blue-700"
                  onClick={() => navigate('/orders')}
                >
                  View Order Details
                </button>
                <button 
                  className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors hover:bg-gray-200"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
            
            {/* Contact info */}
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
              Questions about your order? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credits