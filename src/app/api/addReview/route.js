import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { Review } from '@/models/Review';

export async function POST(req) {
  await dbConnect();
  const { stars, description, productId } = await req.json();

  try {
    const review = new Review({ stars, description, productId });
    await review.save();
    return NextResponse.json({ message: 'Review submitted successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review', details: error.message }, { status: 500 });
  }
}