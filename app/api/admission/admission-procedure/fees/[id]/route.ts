import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Fees from '@/lib/models/Fees';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // params-কে await করে id বের করা হয়েছে
    const body = await req.json();

    const updated = await Fees.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Data not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
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
    const { id } = await params; // params-কে await করে id বের করা হয়েছে

    const deleted = await Fees.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Data not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}