import { Cart } from "../../../models/CartModel";
import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from 'next/server';


export async function POST(request) {
    await dbConnect();
  
    try {
      const { userId, productId } = await request.json();
  
      if (!productId) {
        return Response.json(
          {
            success: false,
            message: 'Product ID is required',
          },
          { status: 400 }
        );
      }
  
      let cartlist;

      if (userId) {
        cartlist = await Cart.findOne({ user: userId });
      }
  
        const productIndex = cartlist.products.findIndex(p => p.productId.toString() === productId);
  
        if (productIndex > -1) {
          cartlist.products[productIndex].quantity -= 1;
        } 
      await cartlist.save();

      return Response.json(
        {
          success: true,
          message: 'Product removed from the cart successfully',
          cartlist
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Error removing product from the cart:', error);
      return Response.json(
        {
          success: false,
          message: 'Error removing product from cart',
          error: error.message
        },
        { status: 500 }
      );
    }
  }