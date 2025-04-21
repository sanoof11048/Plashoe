import React, { useState, useEffect } from "react";
import Footer from "./footer";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { Send, User, Mail, MessageSquare, FileText } from 'lucide-react';
import BgImg from "../assets/image2.jpg"

function ContactForm() {
  const navigate = useNavigate();
  const notifyOk = () => toast("Thank you for your message!");

  // Animated placeholder state
  const [activeField, setActiveField] = useState(null);
  const [formComplete, setFormComplete] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Check if form is complete
  useEffect(() => {
    const { name, email, subject, message } = formData;
    setFormComplete(name && email && subject && message);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataSend = new FormData();

    formDataSend.append("name", formData.name);
    formDataSend.append("email", formData.email);
    formDataSend.append("subject", formData.subject);
    formDataSend.append("message", formData.message);
    try {
      const response = fetch(
        "https://script.google.com/macros/s/AKfycbwIrf3Z1oLRjVwSQPyXRuYC52T5kp3sRo6IuDMw20C64boxhDxvRNANoQWgX6V3zxpz/exec",
        {
          method: "POST",
          body: formDataSend,
        }
      );

      if (response.ok) {
        alert("Form submitted successfully");
        window.location.reload();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }

    notifyOk();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="flex-1 relative"
        style={{
          backgroundImage: `url(${BgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        
        <Navbar />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-24">
          {/* Animated heading with highlight */}
          <div className="text-center mb-12">
            <h2 className="relative inline-block text-4xl font-bold text-white mb-4">
              Get In Touch
              <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-green-400 rounded-full"></span>
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Have questions about our products? Need support with your order? 
              We'd love to hear from you!
            </p>
          </div>

          {/* Card with perspective effect */}
          <div className="max-w-2xl mx-auto ">
            <div className="bg-white/50 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-green-300/20 hover:-translate-y-1">
              {/* Card header */}
              <div className="bg-gradient-to-r from-green-600/70 to-emerald-500/50 py-6 px-8">
                <h3 className="text-white text-xl font-semibold">Send Us a Message</h3>
                <p className="text-green-100 text-sm mt-1">We'll get back to you as soon as possible</p>
              </div>
              
              {/* Form content */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-5">
                  {/* Name field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setActiveField('name')}
                      onBlur={() => setActiveField(null)}
                      className={`pl-10 w-full p-3 border-2 rounded-lg bg-gray-50 focus:outline-none transition-all duration-300 ${
                        activeField === 'name' ? 'border-green-500 shadow-sm' : 'border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      className={`pl-10 w-full p-3 border-2 rounded-lg bg-gray-50 focus:outline-none transition-all duration-300 ${
                        activeField === 'email' ? 'border-green-500 shadow-sm' : 'border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  {/* Subject field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setActiveField('subject')}
                      onBlur={() => setActiveField(null)}
                      className={`pl-10 w-full p-3 border-2 rounded-lg bg-gray-50 focus:outline-none transition-all duration-300 ${
                        activeField === 'subject' ? 'border-green-500 shadow-sm' : 'border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  {/* Message field */}
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MessageSquare size={18} className="text-gray-400" />
                    </div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField(null)}
                      rows="4"
                      className={`pl-10 w-full p-3 border-2 rounded-lg bg-gray-50 focus:outline-none transition-all duration-300 ${
                        activeField === 'message' ? 'border-green-500 shadow-sm' : 'border-gray-200'
                      }`}
                      required
                    ></textarea>
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full group relative overflow-hidden rounded-lg p-4 text-lg font-medium transition-all duration-300 ${
                        formComplete 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!formComplete}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>Send Message</span>
                        <Send size={18} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      {formComplete && (
                        <span className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-green-600 to-emerald-700 transition-transform duration-300"></span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Mail size={18} className="mr-2 text-green-400" /> Email Us
                </h3>
                <p className="text-gray-300">support@plashoe.com</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-green-400" /> Customer Service
                </h3>
                <p className="text-gray-300">Monday-Friday: 9am-5pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactForm;