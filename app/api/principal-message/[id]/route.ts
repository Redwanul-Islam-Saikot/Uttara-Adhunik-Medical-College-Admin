import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PrincipalMessage from '@/lib/models/PrincipalMessage';
import mongoose from 'mongoose';

// PUT Request (Update)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Next.js 15+ এ params await করতে হয়
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("Received ID on Server:", id); // Terminal এ চেক করার জন্য

    // MongoDB ObjectId Valid কি না তা যাচাই
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: `Invalid Mongo ID provided: ${id}` },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedItem = await PrincipalMessage.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found in Database' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE Request
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: `Invalid Mongo ID provided: ${id}` },
        { status: 400 }
      );
    }

    const deletedItem = await PrincipalMessage.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found in Database' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}