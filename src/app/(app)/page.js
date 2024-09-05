'use client'
import Image from "next/image";
import {Header,Featured,NewProducts} from "../../components"
import { useAppSelector } from "@/lib/store/hooks";
import CartComponent from "@/components/DataFetcher";



export default function HomePage({featuredProduct,newProducts}) {

const data = useAppSelector(state=> state.product)
  return (
    <div>
      <Header />
      <Featured product={data?.products[0]} />
      <NewProducts products={data?.filterProducts} />
    </div>
  );
}
