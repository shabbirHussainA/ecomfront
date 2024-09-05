'use client'

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { searching } from "@/lib/store/features/product/productSlice";
import { useState } from "react";
function Searching() {

    const dispatch = useAppDispatch()
    const data = useAppSelector((state)=> state.product)
    const [text, settext] = useState(data.searchText);
    useEffect(() => {
        dispatch(searching(text));
        },[text,settext])
  return (

    <NavLink href={'/cart'} onClick={logout}>Cart ({data?.items.length})</NavLink>
    <input onChange={(e)=>  dispatch(searching(e.target.value))}/>
  )
}

export default Searching
