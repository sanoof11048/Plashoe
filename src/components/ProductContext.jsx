import React, { createContext, useContext, useState, useEffect } from "react";
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
    setIsLoading(true);
    axios.get("http://plashoe.runasp.net/api/Product/get-all")
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
    axios.get(`https://localhost:7072/api/Product/search/${searchValue}`)
    .then((res)=>{
      setFilterProducts(res.data)
    })

  };

  const filterByCategory = (category) => {
    if(category=="All"){
      setFilterProducts(products);
    }
    else{
      axios.get(`https://localhost:7072/api/Product/category/${category}`)
      .then((res)=>{
  setFilterProducts(res.data)
      })
    }
    // https://localhost:7072/api/Product/category/Men
    // setCategory(category);
    // if (category === "All") {
    //   setFilterProducts(products);
    // } else {
    //   setFilterProducts(
    //     products.filter((product) => product.category === category)
    //   );
    // }

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