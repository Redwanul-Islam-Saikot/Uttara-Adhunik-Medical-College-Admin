import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Vision from '@/lib/models/Vision';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const vision = await Vision.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: vision });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { titleRegular, title, description, imageUrl } = body;

    // Frontend er titleRegular key ke 'title' variable e pass kora hochhe support er jonno
    const finalTitle = titleRegular || title;

    if (!finalTitle || !description || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const vision = await Vision.create({
      titleRegular: finalTitle,
      title: finalTitle, // Database support er jonno duto-i set rakha hochhe
      description,
      imageUrl,
    });

    return NextResponse.json({ success: true, data: vision });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Operation failed' },
      { status: 500 }
    );
  }
}