'use client'
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useSession } from "next-auth/react";
import { addWish, removeWish } from "@/lib/store/features/wishproduct/wishSlice";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function wishPage() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const wishState = useAppSelector((state) => state.wish.wishProduct);
  const productState = useAppSelector((state) => state.product.products);

  useEffect(() => {
    // wish Product Getter
    function getwishProductDetails(productsArray, wishArray) {
      if (productsArray.length > 0 && wishArray.length > 0) {
        let wishProduct = [];
        wishArray.forEach(wa => {
          productsArray.forEach(pa => {
            if (wa.productId === pa._id) {
                wishProduct.push({...pa,quantity: wa.quantity})
                console.log(wa)
            }
            else{
                console.log("not found")
            }
          });
        });
        return wishProduct;
      } else {
        console.log("Both inputs should be arrays");
      }
    }

    const wishDetails = getwishProductDetails(productState, wishState);
    console.log("wish Products :",wishDetails);
    setProducts(wishDetails);
  }, [productState, wishState]);

  async function moreOfThisProduct(id) {
    dispatch(addWish({productId:id}));
    if (session) {
        try { 
          const response = await axios.post('/api/addWish', {
            userId: session.user._id,
            productId: id
          }, {
            headers: {
              'Content-Type': 'appliwation/json',
            }
          });
      
          const data = response.data;
          if (data.success) {
            console.log('wish saved successfully:', data.wishlist.products);
          } else {
            console.error('Error saving wish:', data.message);
          }
        } catch (error) {
          console.error('Error saving wish:', error.response ? error.response.data.message : error.message);
        }
      }
  }

  async function lessOfThisProduct(id) {
    dispatch(removeWish({productId:id}));
    if (session) {
        try { 
          const response = await axios.post('/api/removeWish', {
            userId: session.user._id,
            productId: id
          }, {
            headers: {
              'Content-Type': 'appliwation/json',
            }
          });
      
          const data = response.data;
          if (data.success) {
            console.log('wish saved successfully:', data.wishlist.products);
          } else {
            console.error('Error saving wish:', data.message);
          }
        } catch (error) {
          console.error('Error saving wish:', error.response ? error.response.data.message : error.message);
        }
      }
  }
  
  const total = products?.reduce((acc, product) => acc + (product.quantity * product.price), 0);
  
  return (
    <>
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>wish</h2>
            {!products?.length && (
              <div>Your wish is empty</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {product.quantity}
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                      </td>
                      <td>
                        ${product.quantity * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
        </ColumnsWrapper>
      </Center>
    </>
  );
}
