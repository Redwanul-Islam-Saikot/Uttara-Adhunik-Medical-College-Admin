import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Vision from '@/lib/models/Vision';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// PUT: Edit History / Vision by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ Params Await Fix

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    const body = await req.json();
    const { titleRegular, title, description, imageUrl } = body;
    const finalTitle = titleRegular || title;

    const updatedVision = await Vision.findByIdAndUpdate(
      id,
      {
        titleRegular: finalTitle,
        title: finalTitle,
        description,
        imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedVision) {
      return NextResponse.json({ success: false, message: 'Record not found in database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedVision });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Update failed' },
      { status: 500 }
    );
  }
}

// DELETE: Delete History / Vision by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ Params Await Fix

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    const deletedVision = await Vision.findByIdAndDelete(id);

    if (!deletedVision) {
      return NextResponse.json({ success: false, message: 'Record not found in database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Delete failed' },
      { status: 500 }
    );
  }
}