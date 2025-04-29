import React, { createContext, useContext, useState, useEffect } from "react";
import axiosAuth from "../api/axiosAuth";
import axios from "axios";

const ProductContext = createContext();

export const useProductContext = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [filterProducts, setFilterProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  //   axios.get('/api/proxy?path=Product/get-all')
  // .then(response => console.log(response))
  // .catch(error => console.log(error));
  //   setIsLoading(true);
  //   axiosAuth.get("?path=Product/get-all")

    
  //     .then((res) => {
  //       console.log(res);
  //       console.log(res.data);
  //       setProducts(res.data);
  //       setFilterProducts(res.data);
  //     })
      // .catch(error => {
      //   console.error("Failed to fetch products:", error);
      // })
      // .finally(() => {
      //   setIsLoading(false);
      // });

      fetchProducts();  
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/proxy', {
        params: {
          path: 'Product/get-all',  // Backend API path
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };


  const toSearch = (searchValue) => {
    if (!searchValue.trim()) {
      filterByCategory(category);
      return;
    }
    axiosAuth.get(`/Product/search/${searchValue}`)
    .then((res)=>{
      setFilterProducts(res.data)
    })

  };

  const filterByCategory = (category) => {
    if(category=="All"){
      setFilterProducts(products);
    }
    else{
      axiosAuth.get(`/Product/category/${category}`)
      .then((res)=>{
  setFilterProducts(res.data)
      })
    }
  };

  return (
    <ProductContext.Provider
      value={{ 
        products, 
        filterProducts, 
        category, 
        filterByCategory, 
        toSearch, 
        isLoading 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};