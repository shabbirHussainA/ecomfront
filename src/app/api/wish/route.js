// src/app/api/Wish/route.js working
import dbConnect from "../../../lib/dbConnect";
import {Wishlist} from "../../../models/WishlistModel"; // Assuming you have a Wishlist model

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

    // Fetch the Wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId });
      
    if (!wishlist) {
      return Response.json({
        success: false,
        message: "No Wishlist found for this user"
      },{status:404});
    }

    return Response.json(wishlist);
  } catch (error) {
    console.error('Error fetching Wishlist:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch Wishlist',
      error: error.message
    },{status:500});
  }
}
