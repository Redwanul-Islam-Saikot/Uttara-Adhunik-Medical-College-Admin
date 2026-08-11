import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OurFacility from '@/lib/models/OurFacility';

// GET: Fetch Facilities
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const facilities = await OurFacility.find({
        $or: [
          { slug: slug },
          { slug: new RegExp(`^${slug}-`) },
          { title: new RegExp(`^${slug}$`, 'i') },
        ],
      }).sort({ createdAt: -1 });

      return NextResponse.json({ success: true, data: facilities });
    }

    const facilities = await OurFacility.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: facilities });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Create New Facility
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const baseSlug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'facility');
    
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await OurFacility.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    // Explicitly destructure body to exclude old unused fields
    const { title, heading, fullDescription, image, buttonText, buttonLink, order } = body;

    const newFacility = await OurFacility.create({
      title,
      slug: uniqueSlug,
      heading,
      fullDescription,
      image,
      buttonText,
      buttonLink,
      order,
    });

    return NextResponse.json({ success: true, data: newFacility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}