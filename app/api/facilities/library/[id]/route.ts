import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Library from '@/lib/models/Library';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();

    const updated = await Library.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const deleted = await Library.findByIdAndDelete(resolvedParams.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}