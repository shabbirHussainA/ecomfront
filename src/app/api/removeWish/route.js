import { Wishlist } from "../../../models/WishlistModel";
import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await dbConnect();

    try {
        const { userId, productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product ID is required',
                },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required',
                },
                { status: 400 }
            );
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Wishlist not found for the user',
                },
                { status: 404 }
            );
        }

        const productIndex = wishlist.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            wishlist.products[productIndex].quantity -= 1;
            if (wishlist.products[productIndex].quantity <= 0) {
                wishlist.products.splice(productIndex, 1); // Remove the product if quantity is 0 or less
            }
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Product not found in the wishlist',
                },
                { status: 404 }
            );
        }

        await wishlist.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Product removed from the wishlist successfully',
                wishlist
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error removing product from the wishlist:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error removing product from wishlist',
                error: error.message
            },
            { status: 500 }
        );
    }
}
