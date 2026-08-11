import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Publication } from '@/lib/models/Publication';

// UPDATE Item (PUT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // params await করতে হবে
    const body = await req.json();

    const updatedPub = await Publication.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPub) {
      return NextResponse.json({ success: false, error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPub });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE Item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // params await করতে হবে

    const deletedPub = await Publication.findByIdAndDelete(id);

    if (!deletedPub) {
      return NextResponse.json({ success: false, error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}