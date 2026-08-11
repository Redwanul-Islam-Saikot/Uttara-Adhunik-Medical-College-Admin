import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VisitingSection from '@/lib/models/VisitingSection';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedData = await VisitingSection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: false,
    });

    if (!updatedData) {
      return NextResponse.json({ success: false, message: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedData = await VisitingSection.findByIdAndDelete(id);

    if (!deletedData) {
      return NextResponse.json({ success: false, message: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}