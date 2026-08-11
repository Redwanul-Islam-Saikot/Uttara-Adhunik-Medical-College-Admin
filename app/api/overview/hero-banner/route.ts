import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeroBanner from '@/lib/models/AboutHero';

export const dynamic = 'force-dynamic';

// READ: Fetch all banners or filter by query parameter (?page=facilities)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');

    const filter = page ? { page } : {};
    const banners = await HeroBanner.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: banners }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// CREATE: Add new hero banner
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newBanner = await HeroBanner.create(body);
    return NextResponse.json({ success: true, data: newBanner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}