import { Wishlist } from "@/models/WishlistModel";
import dbConnect from "../../../lib/dbCOnnect";
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
  
      let wishlist;
  
      if (userId) {
        wishlist = await Wishlist.findOne({ user: userId });
      }
  
      if (!wishlist) {
        wishlist = new Wishlist({
          user: userId,
          products: [{ productId, quantity: 1 }]
        });
      } else {
        const productIndex = wishlist.products.findIndex(p => p.productId.toString() === productId);
  
        if (productIndex > -1) {
          wishlist.products[productIndex].quantity += 1;
        } else {
          wishlist.products.push({ productId, quantity: 1 });
        }
      }
  
      await wishlist.save();
  
      return Response.json(
        {
          success: true,
          message: 'Product added to wishlist successfully',
          wishlist
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      return Response.json(
        {
          success: false,
          message: 'Error adding product to wishlist',
          error: error.message
        },
        { status: 500 }
      );
    }
  }