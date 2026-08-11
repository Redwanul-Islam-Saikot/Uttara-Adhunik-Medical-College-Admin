import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MedicalService from '@/lib/models/MedicalService';

// UPDATE SERVICE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js App Router-এ params await করতে হয়
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const updatedService = await MedicalService.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE SERVICE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js App Router-এ params await করতে হয়

    if (!id) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const deletedService = await MedicalService.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}