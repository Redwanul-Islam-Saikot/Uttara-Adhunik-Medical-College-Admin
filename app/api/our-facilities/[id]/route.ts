import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OurFacility from '@/lib/models/OurFacility';

// UPDATE: Update existing facility
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const { title, heading, fullDescription, image, buttonText, buttonLink, order } = body;

    const updated = await OurFacility.findOneAndUpdate(
      { 
        $or: [
          { slug: id },
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
        ] 
      },
      { 
        title,
        heading,
        fullDescription,
        image,
        buttonText,
        buttonLink,
        order,
        slug: id
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Remove facility by ID/Slug
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await OurFacility.findOneAndDelete({
      $or: [
        { slug: id },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
      ]
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}