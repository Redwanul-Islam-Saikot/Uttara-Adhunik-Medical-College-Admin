import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CampusLife from '@/lib/models/CampusLife';

export const revalidate = 0; // Cache disable করে ফাস্ট ফ্রেশ ডাটা আনার জন্য

// GET: All Campus Life Cards
export async function GET() {
  try {
    await connectDB();
    // lean() Mongoose Overhead কমিয়ে রেসপন্স সুপারফাস্ট করে
    const data = await CampusLife.find({}).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add New Card
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.cardTitle || !body.cardImage) {
      return NextResponse.json({ success: false, error: 'Title and Image are required' }, { status: 400 });
    }

    const newCard = await CampusLife.create(body);
    return NextResponse.json({ success: true, data: newCard }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}