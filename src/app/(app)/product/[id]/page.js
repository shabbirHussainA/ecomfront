'use client'

import React, { useState, useEffect } from 'react';
import { Button, Center, Header, ProductImages, Title, WhiteBox } from '@/components';
import CartIcon from '@/components/icons/CartIcon';
import { addCart } from '@/lib/store/features/cart/cartSlice';
import { addWish } from '@/lib/store/features/wishproduct/wishSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import useSWR from 'swr';

// Fetcher function for useSWR to fetch data from the given URL
const fetcher = url => axios.get(url).then(res => res.data);

// Styled components for layout and styling
const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.4rem;
`;

// Main component for user profile
const UserProfile = () => {
  const { data: session } = useSession(); // Get session data using next-auth
  const dispatch = useAppDispatch(); // Get dispatch function from Redux
  const { id } = useParams(); // Get product ID from URL parameters
  const products = useAppSelector(state => state.product.products); // Get products from Redux store
  const product = products.find((item) => item._id === id); // Find the product with the matching ID

  const [rating, setRating] = useState(1); // State for review rating
  const [comment, setComment] = useState(''); // State for review comment

  // Fetch reviews for the product using SWR
  const { data: reviews, error } = useSWR(`/api/reviews?productId=${id}`, fetcher);

  // Log session and reviews data when they change
  useEffect(() => {
    console.log(session);
    console.log(reviews);
  }, [session, reviews]);

  // If product is not found, show loading message
  if (!product) {
    return (
      <>
        <Header />
        <Center>
          <p>Loading...</p>
        </Center>
      </>
    );
  }

  // Function to handle review submission
  async function ReviewSubmit(event) {
    event.preventDefault();
    const data = {
      stars: rating,
      description: comment,
      productId: product._id,
    };
    try {
      const res = await axios.post('/api/addReview', data);
      console.log(res);
      // Reset form after submission
      setRating(1);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  }

  // Function to handle adding product to wishlist
  const handleWish = async() => {
    dispatch(addWish({ productId: product._id }));
    if (session) {
      try { 
        const response = await axios.post('/api/addWish', {
          userId: session.user._id,
          productId: product._id
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        const data = response.data;
        if (data.success) {
          console.log('Wishlist saved successfully:', data.wishlist);
        } else {
          console.error('Error saving wishlist:', data.message);
        }
      } catch (error) {
        console.error('Error saving wishlist:', error.response ? error.response.data.message : error.message);
      }
    }
  }

  // Function to handle adding product to cart
  const handleCart = async() => {
    dispatch(addCart({ productId: product._id }));
    if (session) {
      try { 
        const response = await axios.post('/api/addCart', {
          userId: session.user._id,
          productId: product._id
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        const data = response.data;
        if (data.success) {
          console.log('Cart saved successfully:', data.cartlist.products);
        } else {
          console.error('Error saving cart:', data.message);
        }
      } catch (error) {
        console.error('Error saving cart:', error.response ? error.response.data.message : error.message);
      }
    }
  }

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <Button primary onClick={handleCart}>
                  <CartIcon /> Add to cart
                </Button>
                <Button primary onClick={handleWish}>
                  <CartIcon /> Add to wish
                </Button>
                <h2>Reviews</h2>
                {reviews && reviews.length > 0 ? (
                  <ul>
                    {reviews.map(review => (
                      <li key={review._id}>
                        <strong>{review.stars}</strong>: {review.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews yet.</p>
                )}
                <form onSubmit={ReviewSubmit}>
                  <input
                    type="number"
                    max={5}
                    min={1}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                  />
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
};

export default UserProfile;
