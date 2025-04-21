import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaCreditCard, 
  FaShippingFast, 
  FaUndo, 
  FaLock, 
  FaArrowCircleUp
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const Footer = () => {
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    toast.success(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Pre-Footer Features Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center md:justify-start p-4 hover:bg-gray-800 rounded-lg transition-all duration-300">
              <FaShippingFast className="text-amber-400 mr-3" size={28} />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">Free Shipping</h3>
                <p className="text-xs text-gray-400">On orders over $100</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start p-4 hover:bg-gray-800 rounded-lg transition-all duration-300">
              <FaUndo className="text-amber-400 mr-3" size={28} />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">Easy Returns</h3>
                <p className="text-xs text-gray-400">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start p-4 hover:bg-gray-800 rounded-lg transition-all duration-300">
              <FaCreditCard className="text-amber-400 mr-3" size={28} />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">Secure Payment</h3>
                <p className="text-xs text-gray-400">100% secure checkout</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start p-4 hover:bg-gray-800 rounded-lg transition-all duration-300">
              <FaLock className="text-amber-400 mr-3" size={28} />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">Privacy Guarantee</h3>
                <p className="text-xs text-gray-400">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      {/* <div className="bg-amber-500 text-gray-900">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold">Join Our Newsletter</h2>
            <p className="text-gray-800">Stay updated with new arrivals and exclusive offers</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 w-full md:w-64 focus:outline-none rounded-l-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-gray-900 -ml-10 text-white px-6 py-3 font-medium rounded-r-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div> */}
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">PLASHOE</h2>
              <div className="w-12 h-1 bg-amber-400 mb-4 mx-auto"></div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Elevating your step with premium footwear that combines style, comfort, and sustainability. 
              Our shoes are crafted for those who appreciate quality and conscious fashion.
            </p>
          </div>
          
          {/* Links Column */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6 relative">
              Quick Links
            </h2>
            <div className="w-12 h-1 bg-amber-400 mb-4 mx-auto"></div>

            <ul className="space-y-3">
              <li>
                <a href="/products" className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Shop Collection
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> About Us
                </a>
              </li>
              <li>
                <a href="/sustainability" className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Sustainability
                </a>
              </li>
              <li>
                <a href="/sizing" className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> Size Guide
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span> FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Column */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6 relative">
              Contact Us
            </h2>
              <div className=" w-12 h-1 bg-amber-400 mb-2"></div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-400 mt-1 mr-3" size={18} />
                <span>123 Fashion Street, Design District, NY 10001, USA</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-amber-400 mr-3" size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-amber-400 mr-3" size={16} />
                <span>support@plashoe.com</span>
              </li>
            </ul>
            
          
          </div>
          
          {/* Instagram Feed */}
          <div>
            
            <div className="mt-6">
              <h3 className="text-white font-medium mb-3">Follow Us:</h3>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="container mx-auto px-4 py-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} PLASHOE. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-amber-400 text-sm">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-amber-400 text-sm">Terms of Service</a>
            <a href="/sitemap" className="text-gray-400 hover:text-amber-400 text-sm">Sitemap</a>
          </div>
          
         
        </div>
      </div>
      
  
    </footer>
  );
};

export default Footer;