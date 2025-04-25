import React, { createContext, useContext, useState, useEffect } from "react";
import axiosAuth from "../api/axiosAuth";

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
    setIsLoading(true);
    axiosAuth.get("/Product/get-all")
      .then((res) => {
        setProducts(res.data);
        setFilterProducts(res.data);
      })
      .catch(error => {
        console.error("Failed to fetch products:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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