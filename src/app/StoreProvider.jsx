'use client'

// creating wrapper for store provider 
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore} from '../lib/store/store'
import { getAllProducts } from '@/lib/store/features/product/productSlice'
import CartComponent from '@/components/DataFetcher'
function StoreProvider({children}) {
  const storeRef = useRef()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    // add initial data for products in the store
    storeRef.current.dispatch(getAllProducts())
    
  }
  return <Provider store={storeRef.current}> 
  {/* //this is to load the cart and wish in the store */}
  <CartComponent/>
    {children}
  </Provider>
}

export default StoreProvider
