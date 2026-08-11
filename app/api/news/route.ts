import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার MongoDB কানেকশন ফাইল
import News from '@/lib/models/News';

export async function GET() {
  try {
    await connectDB();
    const newsList = await News.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: newsList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newNews = await News.create(body);
    return NextResponse.json({ success: true, data: newNews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}