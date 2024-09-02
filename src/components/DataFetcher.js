'use client'

// creating a component which fetches the data of the cart and wish from the db to the store 
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/store/hooks';
import axios from 'axios';
import { addCart, addFetchedCart } from '@/lib/store/features/cart/cartSlice'; // Assuming this is the correct path to your cartSlice
import { addWish, addFetchedWish } from '@/lib/store/features/wishproduct/wishSlice';
/**
 * CartComponent is a React functional component that manages the state of the user's cart and wishlist.
 * It fetches the cart and wishlist data either from an API (if the user is signed in) or from localStorage (if the user is not signed in).
 * The fetched data is then dispatched to the Redux store.
 */
const CartComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    /**
     * fetchCart is an asynchronous function that fetches the user's cart data.
     * It sets the loading state to true and clears any previous errors.
     * If the user is signed in, it fetches the cart data from the API.
     * If the user is not signed in, it fetches the cart data from localStorage.
     * The fetched data is then dispatched to the Redux store.
     */
    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        let cartData;
        if (session?.user?._id) {
          // User is signed in, fetch from API
          const response = await axios.get(`/api/cart?userId=${session.user._id}`);
          cartData = response.data;
        } else {
          // User is not signed in, get cart from localStorage
          const localCart = localStorage.getItem('cart');
          cartData = localCart ? JSON.parse(localCart) : null;
        }

        if (cartData) {
          console.log(cartData.products);
          dispatch(addFetchedCart(cartData.products));
        }
        console.log(cartData);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    /**
     * fetchWish is an asynchronous function that fetches the user's wishlist data.
     * It sets the loading state to true and clears any previous errors.
     * If the user is signed in, it fetches the wishlist data from the API.
     * If the user is not signed in, it fetches the wishlist data from localStorage.
     * The fetched data is then dispatched to the Redux store.
     */
    const fetchWish = async () => {
      setLoading(true);
      setError(null);

      try {
        let wishData;
        if (session?.user?._id) {
          // User is signed in, fetch from API
          const response = await axios.get(`/api/wish?userId=${session.user._id}`);
          wishData = response.data;
        } else {
          // User is not signed in, get wishlist from localStorage
          const localwish = localStorage.getItem('wish');
          wishData = localwish ? JSON.parse(localwish) : null;
        }

        if (wishData) {
          console.log(wishData.products);
          dispatch(addFetchedWish(wishData.products));
        }
        console.log(wishData);
      } catch (err) {
        console.error('Error fetching wish:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchWish();
  }, [session, dispatch]);

  return (
    <>
    </>
  );
};

export default CartComponent;
