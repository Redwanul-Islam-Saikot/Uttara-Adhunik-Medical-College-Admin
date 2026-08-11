import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroBanner from '@/lib/models/AboutHero';

// UPDATE: Edit banner by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15: params-কে await করা হয়েছে
    const body = await req.json();

    const updatedBanner = await HeroBanner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBanner) {
      return NextResponse.json(
        { success: false, message: 'Hero banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedBanner, message: 'Updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove banner by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15: params-কে await করা হয়েছে

    const deletedBanner = await HeroBanner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return NextResponse.json(
        { success: false, message: 'Hero banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Hero banner deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}