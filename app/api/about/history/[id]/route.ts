import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // আপনার DB Connection
import HistoryModel from '@/lib/models/History'; // আপনার Model

// PUT / EDIT - ডাটা আপডেট করার জন্য
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ async params
    const body = await req.json();

    const updatedHistory = await HistoryModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedHistory) {
      return NextResponse.json(
        { success: false, message: 'Record not found to update' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedHistory },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update history record' },
      { status: 500 }
    );
  }
}

// DELETE - ডাটা ডিলিট করার জন্য
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15+ async params

    const deletedHistory = await HistoryModel.findByIdAndDelete(id);

    if (!deletedHistory) {
      return NextResponse.json(
        { success: false, message: 'Record not found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete history record' },
      { status: 500 }
    );
  }
}