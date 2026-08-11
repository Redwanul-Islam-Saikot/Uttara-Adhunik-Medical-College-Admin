import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AimObjective from '@/lib/models/AimObjective';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

// PUT: Edit Record
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const updatedRecord = await AimObjective.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecord) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

// DELETE: Remove Record
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const deletedRecord = await AimObjective.findByIdAndDelete(id);

    if (!deletedRecord) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}