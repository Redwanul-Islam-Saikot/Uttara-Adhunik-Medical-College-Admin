import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VisitingSection from '@/lib/models/VisitingSection';

// GET: ডাটাবেজ থেকে ভিজিটিং সেকশনের ডাটা নেওয়ার জন্য
export async function GET() {
  try {
    await connectDB();
    const data = await VisitingSection.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST: নতুন ভিজিটিং ডাটা ডাটাবেজে সেভ করার জন্য
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newData = await VisitingSection.create(body);

    return NextResponse.json(
      { success: true, data: newData },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}