import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার প্রজেক্টের db connection helper
import Fees from '@/lib/models/Fees';

export async function GET() {
  try {
    await connectDB();
    const data = await Fees.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await Fees.create(body);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}