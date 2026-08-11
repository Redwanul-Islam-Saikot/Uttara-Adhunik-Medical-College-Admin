import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Students from '@/lib/models/Students';

// GET SINGLE
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params; // Next.js 15 Compatibility
    const id = resolvedParams.id;

    const item = await Students.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT / EDIT
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    const updatedData = await Students.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedItem = await Students.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}