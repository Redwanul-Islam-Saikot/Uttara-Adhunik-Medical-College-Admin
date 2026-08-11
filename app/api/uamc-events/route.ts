import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UAMCEvent from '@/lib/models/UAMCEvents';

// GET ALL EVENTS
export async function GET() {
  try {
    await connectDB();
    const events = await UAMCEvent.find({}).sort({ createdAt: -1 });
    return NextResponse.json(events || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// CREATE NEW EVENT
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newEvent = await UAMCEvent.create(body);
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create event' }, { status: 400 });
  }
}