import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HospitalInfo from '@/lib/models/Hospitalinfo';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const updated = await HospitalInfo.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deleted = await HospitalInfo.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}