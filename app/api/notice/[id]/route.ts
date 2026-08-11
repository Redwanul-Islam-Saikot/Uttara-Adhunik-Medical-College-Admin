import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notice } from '@/lib/models/Notice';

// UPDATE NOTICE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      {
        title: body.title,
        day: body.day,
        monthYear: body.monthYear,
        time: body.time,
        pdfUrl: body.pdfUrl || '',
        category: body.category,
      },
      { new: true }
    );

    if (!updatedNotice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedNotice }, { status: 200 });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notice' },
      { status: 500 }
    );
  }
}

// DELETE NOTICE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return NextResponse.json(
        { success: false, error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete notice' },
      { status: 500 }
    );
  }
}