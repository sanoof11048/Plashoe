<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axiosAuth from "../api/axiosAuth";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      axiosAuth.get(`/user/${userId}`).then((res) => {
        console.log(res.data);

        setUser(res.data);
      }).catch((err)=>{
        if(err.response?.status==401){
          // navigate('/login')
          toast("Session Expired please Login") 
          // localStorage.clear()
        }
        console.log(err)
      });

    }
  }, []);

  const priceHandle = (amountc) => {
    setAmount(amountc);
  };
  const toPurchase = (userCart) => {
    console.log(userCart);
    setOrders(userCart);
  };

  const confirmOrder = async (orderData) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const response = await axiosAuth.post(`/Order/place`,orderData);

      if (response.status === 200) {

        toast.success("Order placed successfully!")
        navigate("/credit")
      } else {
        toast.error("Order failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(" Could not place order");
    }
  };

  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
        priceHandle,
        amount,
        orders,
        toPurchase,
        confirmOrder,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
=======
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axiosAuth from "../api/axiosAuth";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      axiosAuth.get(`/user/${userId}`).then((res) => {
        console.log(res.data);

        setUser(res.data);
      }).catch((err)=>{
        if(err.response?.status==401){
          // navigate('/login')
          toast("Session Expired please Login") 
          // localStorage.clear()
        }
        console.log(err)
      });

    }
  }, []);

  const priceHandle = (amountc) => {
    setAmount(amountc);
  };
  const toPurchase = (userCart) => {
    console.log(userCart);
    setOrders(userCart);
  };

  const confirmOrder = async (orderData) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const response = await axiosAuth.post(`/Order/place`,orderData);

      if (response.status === 200) {

        toast.success("Order placed successfully!")
        navigate("/credit")
      } else {
        toast.error("Order failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(" Could not place order");
    }
  };

  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
        priceHandle,
        amount,
        orders,
        toPurchase,
        confirmOrder,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
>>>>>>> 8ba31eefe9bb0b3b77c489ebabe5fde817c4117c
