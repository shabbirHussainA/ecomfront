//todo add changes to send cart details to the checkout 
import { dbconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  try {
    // Fetching data from the request body
    const {
      name, email, city,
      postalCode, streetAddress, country,
      cartProducts,
    } = await req.json();

    // Connect to the database
    await dbconnect();

    // Extract product IDs from the cart and get unique IDs
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];

    // Fetch product information from the database for the unique product IDs
    const productsInfos = await Product.find({ _id: { $in: uniqueIds } });

    // Prepare line items for Stripe checkout
    let line_items = [];
    for (const productId of uniqueIds) {
      // Find product information for the current product ID
      const productInfo = productsInfos.find(p => p._id.toString() === productId);
      // Calculate the quantity of the current product in the cart
      const quantity = productsIds.filter(id => id === productId)?.length || 0;
      // If the product exists and quantity is greater than 0, add it to line items
      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: { name: productInfo.title },
            unit_amount: productInfo.price * 100, // Stripe expects the amount in cents
          },
        });
      }
    }

    // Create an order document in the database
    const orderDoc = await Order.create({
      line_items, name, email, city, postalCode,
      streetAddress, country, paid: false,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.PUBLIC_URL}/cart?success=1`, // URL to redirect to on successful payment
      cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`, // URL to redirect to if payment is canceled
      metadata: { orderId: orderDoc._id.toString(), test: 'ok' }, // Additional metadata
    });

    // Respond with the URL of the Stripe checkout session
    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    // Log the error and respond with an error message
    console.error('Error processing order:', error);
    return NextResponse.json({
      success: false,
      message: 'Error processing order',
      error: error.message
    }, { status: 500 });
  }
}
