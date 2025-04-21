import React, { useState, useEffect } from "react";
import { useUser } from "./userContext";
import { useNavigate } from "react-router";
import { CreditCard, Lock, Calendar, User, Mail, MapPin, AlertCircle, CheckCircle, Truck, ChevronDown } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import axiosAuth from "../api/axiosAuth";

export default function EnhancedPayment() {
  const navigate = useNavigate();
  const { amount, confirmOrder, user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    addressId: "",
    paymentMethod: "COD",
    cardNumber: "",
    expiry: "",
    cvc: "",
    isProcessing: false,
    errors: {}
  });

  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  useEffect(() => {
    if (formData.addressId) {
      fetchAddressbyId()
    }
  }, [formData.addressId]);

  const fetchAddressbyId = () => {
    axiosAuth
      .get(`/Address/address/${formData.addressId}`)
      .then((res) => {
        setAddress(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch address", err);
      });
  }


  useEffect(() => {
    if (user?.id) {
      fetchUserAddresses(user.id);
    }
  }, [user]);


  const fetchUserAddresses = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7072/api/Address/${userId}`);
      setUserAddresses(response.data);

      // Set default address if available
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setFormData(prev => ({
          ...prev,
          addressId: defaultAddress.addressId,
          name: defaultAddress.fullName,
          email: defaultAddress.email
        }));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddNewAddress = async () => {
    try {
      console.log(newAddress)
      const response = await axios.post(`https://localhost:7072/api/Address/${user.id}`, newAddress);
      if (response.status === 200) {
        await fetchUserAddresses(user.id);
        setShowNewAddressForm(false);
        setNewAddress({
          fullName: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zipCode: "",
          isDefault: false
        });
      }
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  useEffect(() => {
    // Validate current step
    if (step === 1) {
      const { name, email, addressId } = formData;
      setIsValid(name.trim() !== "" && email.includes('@') && addressId !== "");
    } else if (step === 2) {
      if (formData.paymentMethod === "COD") {
        setIsValid(true);
      } else {
        const { cardNumber, expiry, cvc } = formData;
        setIsValid(
          cardNumber.replace(/\s/g, '').length === 16 &&
          /^\d{2}\/\d{2}$/.test(expiry) &&
          cvc.length === 3
        );
      }
    }
  }, [formData, step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
      errors: {
        ...formData.errors,
        [name]: ""
      }
    });
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const selectAddress = (address) => {
    setFormData({
      ...formData,
      addressId: address.addressId,
      name: address.fullName,
      email: address.email
    });
    setShowAddressDropdown(false);
  };

  const nextStep = () => {
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, isProcessing: true });

    try {
      const response = await axios.get(
        `https://localhost:7072/api/Cart/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const cartItems = response.data.data.items;

      const orderData = {
        userId: user.id,
        addressId: formData.addressId,
        transactionId: "TXN" + Date.now(), // or any proper payment txn id
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          totalPrice: item.quantity * item.price,
        })),
      };

      await confirmOrder(orderData);

      setFormData({ ...formData, isProcessing: false });


    } catch (error) {
      console.error("Error submitting order:", error);
      setFormData({ ...formData, isProcessing: false });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-blue-700/50 shadow-sm">
        <Navbar />
      </header>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto w-full px-4 mt-8">
        <div className="flex justify-between mb-2">
          <div className="text-sm font-medium text-blue-700">Personal Info</div>
          <div className={`text-sm font-medium ${step >= 2 ? "text-blue-700" : "text-gray-400"}`}>
            Payment Details
          </div>
          <div className={`text-sm font-medium ${step >= 3 ? "text-blue-700" : "text-gray-400"}`}>
            Confirmation
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-grow flex items-start">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
          {/* Step 1: Customer Info */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <div
                    className="p-3 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
                    onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                  >
                    <div className="flex items-center">
                      <MapPin size={18} className="text-gray-400 mr-2" />
                      {formData.addressId ? (
                        <span>
                          {userAddresses.find(a => a.addressId === formData.addressId)?.addressLine1}
                        </span>
                      ) : (
                        <span className="text-gray-400">Select an address</span>
                      )}
                    </div>
                    <ChevronDown size={18} className={`transition-transform ${showAddressDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {showAddressDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div className="p-2">
                        {userAddresses.map(address => (
                          <div
                            key={address.addressId}
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${address.addressId === formData.addressId ? 'bg-blue-50' : ''}`}
                            onClick={() => selectAddress(address)}
                          >
                            <div className="font-medium">{address.fullName}</div>
                            <div className="text-sm">{address.addressLine1}</div>
                            {address.addressLine2 && <div className="text-sm">{address.addressLine2}</div>}
                            <div className="text-sm">{address.city}, {address.state} {address.zipCode}</div>
                            {address.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                        ))}
                        <div
                          className="p-3 text-blue-600 font-medium cursor-pointer border-t border-gray-200 mt-2"
                          onClick={() => {
                            setShowAddressDropdown(false);
                            setShowNewAddressForm(true);
                          }}
                        >
                          + Add new address
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {showNewAddressForm && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-3">Add New Address</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={newAddress.email}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={newAddress.addressLine1}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={newAddress.addressLine2}
                          onChange={handleNewAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleNewAddressChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={newAddress.zipCode}
                            onChange={handleNewAddressChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={handleNewAddressChange}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Set as default address</label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowNewAddressForm(false)}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddNewAddress}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!isValid}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Steps 2 and 3 remain the same as your original code */}
          {/* ... */}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: "NetBanking" })}
                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === "NetBanking"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === "NetBanking" ? "border-blue-500" : "border-gray-300"
                        }`}>
                        {formData.paymentMethod === "NetBanking" && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="font-medium">Credit / Debit Card</span>
                      </div>
                      <div className="ml-auto flex space-x-2">
                        <div className="w-10 h-6 bg-blue-100 rounded"></div>
                        <div className="w-10 h-6 bg-red-100 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === "COD"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === "COD" ? "border-blue-500" : "border-gray-300"
                        }`}>
                        {formData.paymentMethod === "COD" && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="font-medium">Cash On Delivery</span>
                      </div>
                      <div className="ml-auto">
                        <Truck size={20} className="text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === "NetBanking" && (
                  <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <CreditCard size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleChange}
                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isValid}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Summary & Confirmation */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4">Customer Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Shipping Address</p>
                      <p className="font-medium">{formData.addressId}</p>
                      <p className="font-medium">
                        {address
                          ? `${address.addressLine1}, ${address.addressLine2}, ${address.city}, ${address.state} - ${address.zipCode}`
                          : "Loading address..."}
                      </p>

                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4">Payment Method</h3>
                  <div className="flex items-center">
                    {formData.paymentMethod === "NetBanking" ? (
                      <>
                        <CreditCard size={20} className="text-blue-600" />
                        <span className="ml-2 font-medium">Credit Card ending in {formData.cardNumber.slice(-4)}</span>
                      </>
                    ) : (
                      <>
                        <Truck size={20} className="text-blue-600" />
                        <span className="ml-2 font-medium">Cash On Delivery</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>${(amount * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Tax</span>
                    <span>${(amount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mt-4">
                    <span>Total</span>
                    <span>${amount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {formData.isProcessing ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-4"></div>
                    <p className="text-gray-600">Processing your payment...</p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-200 flex items-center"
                    >
                      <Lock size={16} className="mr-2" />
                      Complete Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
      {/* // </div> */}

      {/* Order Security Info and Footer remain the same */}
      {/* ... */}
      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <Lock size={24} className="text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-800">Secure Payment</h3>
            <p className="text-sm text-gray-500 mt-1">All transactions are encrypted and secure</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck size={24} className="text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-800">Fast Delivery</h3>
            <p className="text-sm text-gray-500 mt-1">Free shipping on orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircle size={24} className="text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-800">Quality Guarantee</h3>
            <p className="text-sm text-gray-500 mt-1">30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}