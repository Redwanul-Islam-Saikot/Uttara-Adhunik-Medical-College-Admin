import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FacilityPage from '@/lib/models/FacilityPage';

// PUT Method (Edit / Update করার জন্য)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await FacilityPage.findByIdAndUpdate(id, { $set: body }, { new: true });
    
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE Method (ডিলেট করার জন্য)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await FacilityPage.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}