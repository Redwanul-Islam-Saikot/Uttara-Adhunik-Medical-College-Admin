import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার DB Connection ফাইল অনুযায়ী
import { Event } from '@/lib/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newEvent = await Event.create(body);
    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}