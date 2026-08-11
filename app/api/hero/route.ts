import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hero } from '@/lib/models/Hero';

// GET ALL BANNERS
export async function GET() {
  try {
    await connectDB();
    const heroes = await Hero.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: heroes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// CREATE NEW BANNER
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Custom string ID নিশ্চিত করা
    const newHeroData = {
      ...body,
      _id: body._id || Date.now().toString(),
    };

    const newHero = await Hero.create(newHeroData);

    return NextResponse.json(
      { success: true, data: newHero },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}