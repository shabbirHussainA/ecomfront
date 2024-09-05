// src/app/api/cart/route.js working
import dbConnect from "../../../lib/dbConnect";
import {Cart} from "../../../models/CartModel"; // Assuming you have a Cart model

export async function GET(request) {
  await dbConnect();
  try {
    // Assuming userId is coming from the query parameters
    const {searchParams} = new URL(request.url)
    const userId =searchParams.get('userId') 
    // Log the userId to debug
    console.log('Received userId:', userId);
  
    // Check if userId is null or undefined
    if (!userId) {
      return Response.json({
        success: false,
        message: "userId is required"
      },{status:400});
    }

    // Fetch the cart for the user
    const cart = await Cart.findOne({user: userId });

    if (!cart) {
      return Response.json({
        success: false,
        message: "No cart found for this user"
      },{status:404});
    }

    return Response.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    },{status:500});
  }
}
