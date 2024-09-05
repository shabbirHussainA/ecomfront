'use client'
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const filterContext = createContext({});

export function FilterContextProvider({ children }) {
  const [filterProducts, setFilterProducts] = useState([]);
  async function fetchProducts() {
    try {
      const response = await axios.get('/api/products');
      setFilterProducts(response.data);
      // console.log(response)
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }
  useEffect(() => {
   

    fetchProducts();
  }, []);

  function searchProduct(text) {
    if (text) {
      setFilterProducts((prevProducts) =>
        prevProducts.filter((curElem) =>
          curElem.title.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      fetchProducts();
    }
  }

  return (
    <filterContext.Provider value={{ filterProducts, searchProduct }}>
      {children}
    </filterContext.Provider>
  );
}
