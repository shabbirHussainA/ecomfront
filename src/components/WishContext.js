'use client'
import {createContext, useEffect, useState} from "react";

export const WishContext = createContext({});

export function WishContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [wishProducts,setWishProducts] = useState([]);
  useEffect(() => {
    if (wishProducts?.length > 0) {
      ls?.setItem('wish', JSON.stringify(wishProducts));
    }
  }, [wishProducts]);
  useEffect(() => {
    if (ls && ls.getItem('wish')) {
      setWishProducts(JSON.parse(ls.getItem('wish')));
    }
  }, []);
  function addWishProduct(productId) {
    setWishProducts(prev => [...prev,productId]);
  }
  function removeWishProduct(productId) {
    setWishProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value,index) => index !== pos);
      }
      return prev;
    });
  }
  function clearWish() {
    setWishProducts([]);
  }
  return (
    <WishContext.Provider value={{wishProducts,setWishProducts,addWishProduct,removeWishProduct,clearWish}}>
      {children}
    </WishContext.Provider>
  );
}