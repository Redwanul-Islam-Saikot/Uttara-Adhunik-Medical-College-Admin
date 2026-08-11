import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MedicalEducationUnit from '@/lib/models/MU';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedFacility = await MedicalEducationUnit.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: false }
    );

    if (!updatedFacility) {
      return NextResponse.json({ success: false, message: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedFacility });
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

    await MedicalEducationUnit.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}