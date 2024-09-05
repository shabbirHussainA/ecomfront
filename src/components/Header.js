'use client'
import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { filterContext } from "./SearchContext";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { searching } from "@/lib/store/features/product/productSlice";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


const StyledHeader = styled.header`
  background-color: #222;
`;
const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;
const StyledNav = styled.nav`
  ${props => props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding:0;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border:0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export default function Header() {
  const [mobileNavActive,setMobileNavActive] = useState(false);
  const data = useAppSelector((state)=> state.product)
  const [text, settext] = useState(data.searchText);
  const dispatch = useAppDispatch()
  const route = useRouter()
  //getting items from the cart store
 const items = useAppSelector(state=> state.cart.items)
//  updating the properties in the store as the useState value changes 
    useEffect(() => {
    dispatch(searching(text));
    },[text,settext])

   
    const logout = async () => {
      await signOut({
        redirect: false, // Prevent automatic redirect
        callbackUrl: `${window.location.origin}/sign-in`, // Manually set redirect URL
      });
      route.push('/sign-in'); // Manually redirect after sign-out
    };
    
      // Explicitly set the redirect URL
    
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo  href={'/'}>Ecommerce</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={'/'}>Home</NavLink>
            <NavLink href={'/products'}>All products</NavLink>
            <NavLink href={'/categories'}>Categories</NavLink>
            <NavLink href={'/account'}>Account</NavLink>
          
            <NavLink href={'/cart'}>Cart ({items.length})</NavLink>

            <input onChange={(e)=>  dispatch(searching(e.target.value))}/>
            <button onClick={logout}>logout </button>
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}