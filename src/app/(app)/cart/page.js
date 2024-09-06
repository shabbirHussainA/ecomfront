'use client'
import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addCart, removeCart } from "@/lib/store/features/cart/cartSlice";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useSession } from "next-auth/react";

// Styled component for wrapping columns
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

// Styled component for a box element
const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

// Styled component for product information cell
const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

// Styled component for product image box
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

// Styled component for quantity label
const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

// Styled component for city holder
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const dispatch = useAppDispatch(); // Hook to dispatch actions
  const { data: session } = useSession(); // Hook to get session data
  const [products, setProducts] = useState([]); // State to store products in the cart
  const cartState = useAppSelector((state) => state.cart); // Hook to get cart state from Redux store
  const productState = useAppSelector((state) => state.product); // Hook to get product state from Redux store

  useEffect(() => {
    // Function to get product details for items in the cart
    function getCartProductDetails(productsArray, cartArray) {
      if (productsArray.length > 0 && cartArray.length > 0) {
        let cartProducts = [];
        cartArray.forEach(ca => {
          productsArray.forEach(pa => {
            if (ca.productId === pa._id) {
                cartProducts.push({...pa, quantity: ca.quantity});
                console.log(ca);
            } else {
                console.log("not found");
            }
          });
        });
        return cartProducts;
      } else {
        console.log("Both inputs should be arrays");
      }
    }

    // Get cart details and set products state
    const cartDetails = getCartProductDetails(productState.products, cartState.items);
    console.log("cart Products:", cartDetails);
    setProducts(cartDetails);
  }, [productState, cartState]);

  // Function to add more of a product to the cart
  async function moreOfThisProduct(id) {
    dispatch(addCart({ productId: id }));
    if (session) {
      try {
        const response = await axios.post('/api/addCart', {
          userId: session.user._id,
          productId: id
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

  // Function to remove a product from the cart
  async function lessOfThisProduct(id) {
    dispatch(removeCart({ productId: id }));
    if (session) {
      try {
        const response = await axios.post('/api/removeCart', {
          userId: session.user._id,
          productId: id
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

  // Calculate total price of products in the cart
  const total = products?.reduce((acc, product) => acc + (product.quantity * product.price), 0);

  return (
    <>
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!products?.length && (
              <div>Your cart is empty</div>
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
