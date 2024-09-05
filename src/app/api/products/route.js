//used to fetch the products working
import { NextResponse } from 'next/server';
import { Product } from "@/models/Product";
import dbConnect from "../../../lib/dbConnect"; 

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({});
    console.log({ products });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
