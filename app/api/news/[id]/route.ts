import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Mongo-generated immutable key remove করা হচ্ছে যাতে Update Error না হয়
    const { _id, createdAt, updatedAt, ...updateData } = body;

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNews) {
      return NextResponse.json({ success: false, error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json({ success: false, error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}