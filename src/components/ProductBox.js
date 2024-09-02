'use client'
import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {useContext, useEffect} from "react";
import {CartContext} from "@/components/CartContext";
import { WishContext } from "@/components/WishContext";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addWish } from "@/lib/store/features/wishproduct/wishSlice";
import { addCart } from "@/lib/store/features/cart/cartSlice";
import axios from "axios";
import {useSession} from 'next-auth/react'
import {user} from 'next-auth'
const ProductWrapper = styled.div`
  
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({_id,title,description,price,images,product}) { 
  //getting session data
  const { data: session } = useSession();
  const dispatch = useAppDispatch()
  //posting data of the wishlist 
const handleWish = async() =>{
  //dispatching value of the product in the redux
  dispatch(addWish({ productId: product._id}))
if(session.user._id){
  try { 
    //sending the product in the db
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
  const handleCart = async() =>{
    dispatch(addCart({ productId: product._id}))
  if(session.user._id){
  //dispatching value of the product in the redux
  
  try { 
    //sending the product in the db
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
      console.log('cartlist saved successfully:', data.cartlist.products);
    } else {
      console.error('Error saving wishlist:', data.message);
    }
  } catch (error) {
    console.error('Error saving wishlist:', error.response ? error.response.data.message : error.message);
  }
}
}
  const url = '/product/'+_id;
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images?.[0]} alt=""/>
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            ${price}
          </Price>
          <Button block onClick={handleCart} primary outline>
            Add to cart
          </Button>
          <Button primary onClick={handleWish}>
                  <CartIcon />Add to wish
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}