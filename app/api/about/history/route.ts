import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার DB Connection ফাইল
import HistoryModel from '@/lib/models/History';

// GET - সব ডাটা ফেচ করার জন্য
export async function GET() {
  try {
    await connectDB();
    const historyList = await HistoryModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: historyList },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch history data' },
      { status: 500 }
    );
  }
}

// POST - নতুন ডাটা তৈরি করার জন্য
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { titleRegular, titleBold, subtitle, description, imageUrl } = body;

    if (!titleRegular || !titleBold || !subtitle || !description || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const newHistory = await HistoryModel.create({
      titleRegular,
      titleBold,
      subtitle,
      description,
      imageUrl,
    });

    return NextResponse.json(
      { success: true, data: newHistory },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create history record' },
      { status: 500 }
    );
  }
}