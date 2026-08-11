import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FacilityPage from '@/lib/models/FacilityPage';

export const maxDuration = 60; // Timeout threshold fix for Next.js

// GET Method
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const data = await FacilityPage.findOne({ pageSlug: slug });
      return NextResponse.json({ success: true, data });
    }

    const allData = await FacilityPage.find({});
    return NextResponse.json({ success: true, data: allData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST Method (Create / Upsert)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.pageSlug) {
      return NextResponse.json({ success: false, message: 'pageSlug is required' }, { status: 400 });
    }

    const updatedData = await FacilityPage.findOneAndUpdate(
      { pageSlug: body.pageSlug },
      { ...body },
      { upsert: true, new: true, runValidators: false }
    );

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}