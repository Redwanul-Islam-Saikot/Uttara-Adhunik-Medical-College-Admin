import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notice } from '@/lib/models/Notice';

// GET ALL NOTICES (With Optional Category Filter)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query = category ? { category } : {};
    const notices = await Notice.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: notices }, { status: 200 });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

// CREATE NOTICE
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newNotice = await Notice.create({
      title: body.title,
      day: body.day,
      monthYear: body.monthYear,
      time: body.time,
      pdfUrl: body.pdfUrl || '',
      category: body.category || 'General Notice',
    });

    return NextResponse.json({ success: true, data: newNotice }, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notice' },
      { status: 500 }
    );
  }
}