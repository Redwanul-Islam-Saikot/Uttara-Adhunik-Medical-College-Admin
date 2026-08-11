import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AlumniEvent from '@/lib/models/AlumniEvent';

export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const data = await AlumniEvent.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const newEvent = await AlumniEvent.create(body);
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}