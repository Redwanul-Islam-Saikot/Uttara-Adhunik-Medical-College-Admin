import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import HeaderInfo from '@/lib/models/HeaderInfo';

// GET ALL
export async function GET() {
  try {
    await connectDB();
    const data = await HeaderInfo.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE NEW
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newHeader = await HeaderInfo.create(body);
    return NextResponse.json({ success: true, data: newHeader }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}