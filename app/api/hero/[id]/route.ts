import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hero } from '@/lib/models/Hero';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is missing' },
        { status: 400 }
      );
    }

    // findOneAndUpdate Mongoose ObjectId চেক এড়িয়ে স্ট্রিং ম্যাচ করে
    const updatedHero = await Hero.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, error: 'Hero item not found in Database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedHero },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedHero = await Hero.findOneAndDelete({ _id: id });

    if (!deletedHero) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}