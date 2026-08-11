import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StatItem from '@/lib/models/StatItem';


// GET All Stats + Background
export async function GET() {
  try {
    await connectDB();

    const stats = await StatItem.find({ value: { $ne: 'SECTION_BG' } }).sort({ order: 1 });
    const bgDoc = await StatItem.findOne({ value: 'SECTION_BG' });

    return NextResponse.json({
      success: true,
      data: stats,
      sectionBg: bgDoc?.bgImage || '',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST New Stat
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newStat = await StatItem.create(body);
    return NextResponse.json({ success: true, data: newStat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}