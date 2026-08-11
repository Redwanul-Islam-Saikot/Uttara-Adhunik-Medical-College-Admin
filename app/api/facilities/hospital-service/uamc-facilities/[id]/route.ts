import { NextResponse } from 'next/server';
import { connectDB} from '@/lib/mongodb'; // Apnar dbConnect helper
import FacilityService from '@/lib/models/FacilityService';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js async params resolved here
    const body = await req.json();

    const updated = await FacilityService.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js async params resolved here

    const deleted = await FacilityService.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}