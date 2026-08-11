import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ContactInfo from '@/lib/models/ContactInfo';

// GET: Fetch contact info
export async function GET() {
  try {
    await connectDB();
    const info = await ContactInfo.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: info || null });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Create Contact Info (If not created before)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newInfo = await ContactInfo.create(body);
    return NextResponse.json({ success: true, data: newInfo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}