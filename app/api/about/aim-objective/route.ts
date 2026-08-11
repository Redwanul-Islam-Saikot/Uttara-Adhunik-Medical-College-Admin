import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AimObjective from '@/lib/models/AimObjective';

export const dynamic = 'force-dynamic';

// GET: Fetch Data
export async function GET() {
  try {
    await connectDB();
    const data = await AimObjective.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}

// POST: Add Data
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newRecord = await AimObjective.create(body);
    return NextResponse.json({ success: true, data: newRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}