import Center from "@/components/Center";
import styled from "styled-components";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";
import { addCart } from "@/lib/store/features/cart/cartSlice";
import axios from "axios";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";

const Bg = styled.div`
  background-color: #222;
  color:#fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size:1.5rem;
  @media screen and (min-width: 768px) {
    font-size:3rem;
  }
`;
const Desc = styled.p`
  color:#aaa;
  font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img{
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img{
      max-width: 100%;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap:10px;
  margin-top:25px;
`;

export default function Featured({product}) {
  // const {addProduct} = useContext(CartContext);
  const { data: session } = useSession();
  const dispatch = useAppDispatch()

       //posting data of the cartlist 
       const handleCart = async() =>{
        dispatch(addCart(product))
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
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product?.title}</Title>
              <Desc>{product?.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink href={'/product/'+product?._id} outline={1} white={1}>Read more</ButtonLink>
                <Button white onClick={handleCart}>
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            <img src={ product?.images[0]} alt=""/>
          </Column>
        </ColumnsWrapper>
      </Center>

    </Bg>
  );
}