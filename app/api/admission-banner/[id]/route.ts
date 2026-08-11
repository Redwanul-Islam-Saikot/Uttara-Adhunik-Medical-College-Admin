import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdmissionBanner from '@/lib/models/AdmissionBanner';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const updated = await AdmissionBanner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || id === 'undefined') {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const deleted = await AdmissionBanner.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}