import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TimelineItem } from '@/lib/models/Timeline';

export const dynamic = 'force-dynamic';

// DELETE ITEM
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const deletedItem = await TimelineItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// EDIT / UPDATE ITEM
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedItem = await TimelineItem.findByIdAndUpdate(
      id,
      { year: body.year, title: body.title },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}